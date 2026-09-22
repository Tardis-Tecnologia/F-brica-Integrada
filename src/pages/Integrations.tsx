import { integrations } from "../data/mock";
import { syncEvents } from "../data/commerce";
import { Tone } from "../components/ui";
import { Logo } from "../components/Sidebar";
import { ArrowRight } from "lucide-react";

export function Integrations() {
  return (
    <div className="stack">
      <p className="lead">
        Tudo aqui é mock. A Fábrica Integrada não substitui Tray nem SINK: ela
        orquestra o fluxo Tray → FI → SINK → NF-e → expedição → WhatsApp.
      </p>

      <div className="sync-strip">
        <div className="sync-node">
          <small>Loja</small>
          <b>Tray</b>
          <em>pedido + endereço</em>
        </div>
        <ArrowRight size={16} />
        <div className="sync-node core">
          <Logo size={28} />
          <b>Fábrica Integrada</b>
          <em>IA + rastreio + cobrança</em>
        </div>
        <ArrowRight size={16} />
        <div className="sync-node">
          <small>ERP</small>
          <b>SINK</b>
          <em>NF-e + boleto</em>
        </div>
        <ArrowRight size={16} />
        <div className="sync-node">
          <small>Cliente / time</small>
          <b>WhatsApp</b>
          <em>atraso e vencimento</em>
        </div>
      </div>

      <div className="panel pad">
        <p className="kicker">Último ciclo · VD-8843</p>
        <h2 className="sync-title">Tray → SINK ERP → WhatsApp</h2>
        <ol className="sync-log">
          {syncEvents.map((e, i) => (
            <li key={i}>
              <span className="mono">{e.t}</span>
              <b>
                {e.from} → {e.to}
              </b>
              <p>{e.text}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="hub">
        {integrations.slice(0, 4).map((s) => (
          <Node key={s.id} name={s.name} layer={s.layer} status={s.status} />
        ))}
        <div className="hub-core">
          <Logo size={42} />
          <strong>Fábrica Integrada</strong>
          <span>camada de cruzamento e IA</span>
        </div>
        {integrations.slice(4, 8).map((s) => (
          <Node key={s.id} name={s.name} layer={s.layer} status={s.status} />
        ))}
      </div>

      <div className="int-grid">
        {integrations.map((s) => (
          <article key={s.id} className="panel pad int-card">
            <div className="int-top">
              <p className="kicker">{s.layer}</p>
              <Tone
                tone={
                  s.status === "Conectado"
                    ? "ok"
                    : s.status === "Sincronizando"
                      ? "info"
                      : "atencao"
                }
              >
                {s.status}
              </Tone>
            </div>
            <h3>{s.name}</h3>
            <p>{s.description}</p>
            <div className="int-meta">
              <span>Última atualização {s.lastSync}</span>
              <span className="mono">{s.eventsToday} eventos hoje</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Node({
  name,
  layer,
  status,
}: {
  name: string;
  layer: string;
  status: string;
}) {
  return (
    <div className="hub-node">
      <small>{layer}</small>
      <b>{name}</b>
      <em className={status === "Atenção" ? "warn" : ""}>{status}</em>
    </div>
  );
}
