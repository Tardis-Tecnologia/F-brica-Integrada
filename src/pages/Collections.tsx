import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  agingBucket,
  agingLabels,
  collectionRules,
  payments,
  slaRules,
  whatsappQueue,
} from "../data/commerce";
import { Panel, PanelHead, Tone } from "../components/ui";
import { useData } from "../state/DataContext";
import { money } from "../lib/format";
import { Bell, MessageCircle } from "lucide-react";

const buckets = ["upcoming", "due_today", "overdue_1_3", "overdue_4_7", "overdue_8_30", "overdue_30_plus"] as const;

export function Collections() {
  const { ping } = useData();
  const [params, setParams] = useSearchParams();
  const bucket = params.get("bucket");
  const list = useMemo(() => {
    if (!bucket) return payments;
    if (bucket === "overdue") return payments.filter((p) => p.status === "Vencido");
    return payments.filter((p) => agingBucket(p) === bucket);
  }, [bucket]);

  return (
    <div className="stack">
      <p className="lead">
        Contas a receber mockadas do SINK. As regras D-5…D+7 ficam configuráveis nesta
        tela — nada hardcoded. Pagamento cancela a fila de cobrança daquele título.
      </p>

      <div className="ops-grid aging">
        {buckets.map((b) => {
          const rows = payments.filter((p) => agingBucket(p) === b);
          return (
            <button
              key={b}
              className={`ops-item ${bucket === b ? "on" : ""}`}
              onClick={() => setParams(bucket === b ? {} : { bucket: b })}
            >
              <span>{agingLabels[b]}</span>
              <b>{rows.length}</b>
              <em>{money(rows.reduce((a, p) => a + p.value, 0))}</em>
            </button>
          );
        })}
      </div>

      <div className="split-2">
        <Panel pad={false}>
          <div className="pad">
            <PanelHead
              kicker={bucket ? agingLabels[bucket] ?? "Filtro" : "Títulos"}
              title="Contas a receber"
              extra={bucket ? <button className="chip" onClick={() => setParams({})}>Limpar</button> : null}
            />
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Cliente</th>
                  <th>Valor</th>
                  <th>Faixa</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {list.map((p) => (
                  <tr key={p.id} className={p.status === "Vencido" ? "row-hot" : p.status === "Vence hoje" ? "row-warm" : ""}>
                    <td className="mono">{p.id}</td>
                    <td>
                      <b>{p.client}</b>
                      <div className="sub">
                        {p.type} · NF-e {p.nfe} · {p.due}
                      </div>
                    </td>
                    <td>{money(p.value, true)}</td>
                    <td>
                      <Tone
                        tone={
                          p.status === "Vencido" ? "critico" : p.status === "Vence hoje" ? "atencao" : p.status === "Pago" ? "ok" : "info"
                        }
                      >
                        {agingLabels[agingBucket(p)]}
                      </Tone>
                    </td>
                    <td>
                      {p.status === "Pago" ? (
                        <span className="hint">fila cancelada</span>
                      ) : (
                        <button
                          className="chip"
                          onClick={() =>
                            ping(
                              p.audience === "cliente"
                                ? `WhatsApp mock enviado a ${p.client} · ${p.id}.`
                                : `Alerta interno mock: ${p.id} no radar.`,
                            )
                          }
                        >
                          {p.audience === "cliente" ? <MessageCircle size={14} /> : <Bell size={14} />}
                          {p.audience === "cliente" ? "Cobrar" : "Alertar"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel>
          <PanelHead kicker="CollectionRule" title="Regras de cobrança (configuráveis)" />
          <table className="dense">
            <thead>
              <tr>
                <th>Quando</th>
                <th>Canal</th>
                <th>Público</th>
                <th>Janela</th>
              </tr>
            </thead>
            <tbody>
              {collectionRules.map((r) => (
                <tr key={r.id}>
                  <td>
                    <b>{r.label}</b>
                    <div className="sub">{r.template}</div>
                  </td>
                  <td>{r.channel}</td>
                  <td>{r.audience}</td>
                  <td>{r.active ? r.window : "off"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="fine">SLA operacional (também mock): {slaRules.map((s) => `${s.from} → ${s.to} ${s.minutes} min`).join(" · ")}</p>
        </Panel>
      </div>

      <Panel>
        <PanelHead kicker="WhatsApp Business" title="Fila simulada — templates prontos, sem API real" />
        <div className="wa-grid">
          {whatsappQueue.map((m) => (
            <article key={m.id} className="wa-card">
              <div className="need-top">
                <Tone tone={m.kind === "Cobrança" ? "atencao" : m.kind === "Rastreio" ? "critico" : "info"}>
                  {m.kind}
                </Tone>
                <span className="hint">{m.phone}</span>
              </div>
              <h4>{m.to}</h4>
              <p>{m.text}</p>
              <button className="secondary" onClick={() => ping(`WhatsApp mock enviado a ${m.to} (${m.kind}).`)}>
                <MessageCircle size={14} /> Enviar agora
              </button>
            </article>
          ))}
        </div>
      </Panel>
    </div>
  );
}
