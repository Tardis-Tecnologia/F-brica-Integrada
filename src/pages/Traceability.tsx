import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  deliveryRulesCatalog,
  shipments,
  trackStages,
  type Shipment,
} from "../data/commerce";
import { Panel, PanelHead, Tone } from "../components/ui";
import { useData } from "../state/DataContext";
import { qty } from "../lib/format";
import { MessageCircle, Printer, TriangleAlert } from "lucide-react";

export function Traceability() {
  const { ping } = useData();
  const [params] = useSearchParams();
  const q0 = params.get("q") ?? "";
  const [q, setQ] = useState(q0);
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return shipments;
    return shipments.filter((x) =>
      [x.id, x.saleId, x.nfe, x.client, x.carrier, x.tracking, x.token].join(" ").toLowerCase().includes(s),
    );
  }, [q]);
  const [id, setId] = useState(filtered[0]?.id ?? shipments[0].id);
  useEffect(() => {
    const hit = shipments.find((s) => [s.id, s.saleId, s.token].includes(q0));
    if (hit) setId(hit.id);
  }, [q0]);
  const ship = shipments.find((s) => s.id === id) ?? filtered[0] ?? shipments[0];
  const delayed = shipments.filter((s) => s.delayHours > 0);
  const current = trackStages.indexOf(ship.stage);

  return (
    <div className="stack">
      <p className="lead">
        Cada venda Tray ou SINK ganha linha do tempo e um token de QR. Pesquise por
        pedido, NF-e, cliente, transportadora ou código. A etiqueta aponta para
        /trace/token — sem jogar CNPJ no QR.
      </p>

      <input
        className="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar pedido, NF-e, cliente, transportadora ou token…"
      />

      <div className="kpi-grid four">
        <article className="kpi">
          <p className="kpi-label">Em trânsito</p>
          <p className="kpi-value">{shipments.filter((s) => s.stage === "Trânsito").length}</p>
          <p className="hint">pedidos com rastreador</p>
        </article>
        <article className="kpi">
          <p className="kpi-label">Atrasados</p>
          <p className="kpi-value">{delayed.length}</p>
          <p className="hint">SLA estourado · alerta IA</p>
        </article>
        <article className="kpi">
          <p className="kpi-label">Sede ≠ entrega</p>
          <p className="kpi-value">
            {shipments.filter((s) => s.billingAddress !== s.deliveryAddress).length}
          </p>
          <p className="hint">etiquetas com regra especial</p>
        </article>
        <article className="kpi">
          <p className="kpi-label">Atraso médio</p>
          <p className="kpi-value">
            {Math.round(delayed.reduce((a, s) => a + s.delayHours, 0) / Math.max(delayed.length, 1))} h
          </p>
          <p className="hint">nos embarques fora do SLA</p>
        </article>
      </div>

      <div className="split-buy">
        <Panel pad={false}>
          <div className="pad">
            <PanelHead kicker="Embarques" title="Rastreio ao vivo" />
          </div>
          <div className="need-list">
            {filtered.map((s) => (
              <button
                key={s.id}
                className={`need-card ${s.id === id ? "on" : ""} ${s.delayHours > 8 ? "alta" : ""}`}
                onClick={() => setId(s.id)}
              >
                <div className="need-top">
                  <Tone
                    tone={
                      s.delayHours > 12 ? "critico" : s.delayHours > 0 ? "atencao" : s.stage === "Entrega" ? "ok" : "info"
                    }
                  >
                    {s.delayHours > 0 ? `+${s.delayHours} h` : s.stage}
                  </Tone>
                  <span className="hint">{s.channel}</span>
                </div>
                <h3>
                  {s.id} · NF-e {s.nfe}
                </h3>
                <p>{s.client}</p>
                <small>
                  {s.carrier} · {s.tracking}
                </small>
              </button>
            ))}
          </div>
        </Panel>

        <div className="stack">
          <Panel>
            <PanelHead
              kicker="Linha do tempo"
              title={`${ship.saleId} · ${ship.product}`}
              extra={
                ship.delayHours > 0 ? (
                  <span className="delay-pill">
                    <TriangleAlert size={14} /> Atraso {ship.delayHours} h vs. SLA {ship.slaHours} h
                  </span>
                ) : (
                  <span className="hint">Dentro do SLA de {ship.slaHours} h</span>
                )
              }
            />
            <div className="track">
              {trackStages.map((st, i) => (
                <div
                  key={st}
                  className={`track-step ${i < current ? "done" : ""} ${i === current ? "now" : ""} ${
                    i === current && ship.delayHours > 0 ? "late" : ""
                  }`}
                >
                  <i />
                  <strong>{st}</strong>
                  {i === current ? <small>agora</small> : i < current ? <small>ok</small> : <small>fila</small>}
                </div>
              ))}
            </div>
            <p className="insight">{ship.note}</p>
            <ol className="sync-log">
              {ship.audit.map((a, i) => (
                <li key={i}>
                  <span className="mono">{a.t}</span>
                  <b>{a.action}</b>
                  <p>
                    {a.origin} · {a.actor}
                  </p>
                </li>
              ))}
            </ol>
          </Panel>

          <LabelCard
            ship={ship}
            onPrint={() =>
              ping(`Etiqueta ${ship.id} gerada · NF-e ${ship.nfe} · ${ship.carrier} · entrega: ${ship.deliveryAddress.split("·")[0].trim()}`)
            }
            onWa={() =>
              ping(`WhatsApp para ${ship.client}: rastreio ${ship.tracking} e endereço de descarga (não a sede).`)
            }
          />
        </div>
      </div>

      <Panel>
        <PanelHead kicker="Regras de entrega" title="O que a etiqueta precisa carregar para não virar dor de cabeça" />
        <div className="capa-grid">
          {deliveryRulesCatalog.map((r) => (
            <article key={r.id} className="capa now">
              <h4>{r.title}</h4>
              <p>{r.detail}</p>
            </article>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function LabelCard({
  ship,
  onPrint,
  onWa,
}: {
  ship: Shipment;
  onPrint: () => void;
  onWa: () => void;
}) {
  return (
    <div className="label-wrap">
      <article className="ship-label">
        <header>
          <div>
            <p className="kicker">Etiqueta de venda · Atlas Polímeros</p>
            <h3>NF-e {ship.nfe}</h3>
          </div>
          <Link className="label-qr" to={`/trace/${ship.token}`}>
            QR · {ship.token}
            <small>{ship.volumes} vol · {ship.tracking}</small>
          </Link>
        </header>
        <dl className="label-grid">
          <div>
            <dt>Pedido</dt>
            <dd>
              {ship.saleId} · {ship.channel} · {qty(ship.qty)} un
            </dd>
          </div>
          <div>
            <dt>Cliente / CNPJ (sede)</dt>
            <dd>
              {ship.client}
              <br />
              {ship.cnpj}
            </dd>
          </div>
          <div className="span2 warn-box">
            <dt>Não entregar na sede · endereço de descarga</dt>
            <dd>{ship.deliveryAddress}</dd>
          </div>
          <div>
            <dt>Faturamento (sede)</dt>
            <dd>{ship.billingAddress}</dd>
          </div>
          <div>
            <dt>Transportadora</dt>
            <dd>
              {ship.carrier}
              <br />
              {ship.tracking}
            </dd>
          </div>
          <div className="span2">
            <dt>Regras de entrega</dt>
            <dd>{ship.rules.join(" · ")}</dd>
          </div>
        </dl>
      </article>
      <div className="label-actions">
        <button className="primary" onClick={onPrint}>
          <Printer size={16} /> Gerar etiqueta
        </button>
        <button className="secondary" onClick={onWa}>
          <MessageCircle size={16} /> Avisar no WhatsApp
        </button>
      </div>
    </div>
  );
}
