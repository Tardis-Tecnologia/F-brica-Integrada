import { certificatesSeed, machinesSeed, statusLabel, type Certificate, type Machine } from "../data/compliance";
import { Panel, PanelHead, Tone } from "../components/ui";
import { useData } from "../state/DataContext";
import { Sparkles, Wrench } from "lucide-react";

function toneOf(s: Certificate["status"] | Machine["status"]) {
  if (s === "overdue") return "critico" as const;
  if (s === "soon" || s === "pending") return "atencao" as const;
  return "ok" as const;
}

export function Compliance() {
  const { certificates, machines, refreshCertificates, ping } = useData();
  const certs = certificates.length ? certificates : certificatesSeed;
  const macs = machines.length ? machines : machinesSeed;
  const certHot = certs.filter((c) => c.status !== "ok");
  const macHot = macs.filter((m) => m.status !== "ok");

  return (
    <div className="stack">
      <p className="lead">
        Toda indústria precisa disso — não só a FLIND. A IA consulta os portais
        públicos e atualiza o vencimento das certidões que dão para renovar sozinhas.
        AVCB, ANVISA e alvará continuam com gente. Máquina atrasada vira alerta antes
        de parar a linha.
      </p>

      <div className="kpi-grid four">
        <article className="kpi">
          <p className="kpi-label">Certidões vencidas</p>
          <p className="kpi-value">{certs.filter((c) => c.status === "overdue").length}</p>
          <p className="hint">bloqueiam licitação e NF-e</p>
        </article>
        <article className="kpi">
          <p className="kpi-label">A vencer (30 dias)</p>
          <p className="kpi-value">{certs.filter((c) => c.status === "soon" || c.status === "pending").length}</p>
          <p className="hint">CND, FGTS, e-CNPJ, AFE</p>
        </article>
        <article className="kpi">
          <p className="kpi-label">Máquinas atrasadas</p>
          <p className="kpi-value">{macs.filter((m) => m.status === "overdue").length}</p>
          <p className="hint">preventiva estourada</p>
        </article>
        <article className="kpi">
          <p className="kpi-label">Atualização automática</p>
          <p className="kpi-value">{certs.filter((c) => c.auto).length}</p>
          <p className="hint">portais que a IA consulta</p>
        </article>
      </div>

      <div className="label-actions">
        <button className="primary" onClick={refreshCertificates}>
          <Sparkles size={16} /> Atualizar certidões com a IA
        </button>
        <button
          className="secondary"
          onClick={() => ping("Agenda de preventiva enviada à TecSolda · solda PE e seladora Toalet.")}
        >
          <Wrench size={16} /> Agendar manutenções atrasadas
        </button>
      </div>

      <Panel pad={false}>
        <div className="pad">
          <PanelHead
            kicker="Certidões"
            title="Renovação — a IA atualiza o que o portal permite"
            extra={<span className="hint">{certHot.length} pedem ação</span>}
          />
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Documento</th>
                <th>Emissor</th>
                <th>Vence</th>
                <th>IA</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {certs.map((c) => (
                <tr key={c.id} className={c.status === "overdue" ? "row-hot" : c.status === "soon" || c.status === "pending" ? "row-warm" : ""}>
                  <td>
                    <b>{c.name}</b>
                    <div className="sub">{c.number} · {c.owner}</div>
                  </td>
                  <td>{c.issuer}</td>
                  <td>
                    {c.expires}
                    <div className="sub">{c.days < 0 ? `${-c.days} dias atrasado` : `${c.days} dias`}</div>
                  </td>
                  <td>{c.auto ? "Automática" : "Humano"}</td>
                  <td>
                    <Tone tone={toneOf(c.status)}>{statusLabel(c.status)}</Tone>
                    <div className="sub">{c.note}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel pad={false}>
        <div className="pad">
          <PanelHead
            kicker="Máquinas"
            title="Períodos de manutenção preventiva"
            extra={<span className="hint">{macHot.length} fora da janela</span>}
          />
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Equipamento</th>
                <th>Linha</th>
                <th>Última</th>
                <th>Próxima</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {macs.map((m) => (
                <tr key={m.id} className={m.status === "overdue" ? "row-hot" : m.status === "soon" ? "row-warm" : ""}>
                  <td>
                    <b>{m.name}</b>
                    <div className="sub">{m.kind} · {m.vendor}</div>
                  </td>
                  <td>{m.line}</td>
                  <td>{m.lastService}</td>
                  <td>
                    {m.nextService}
                    <div className="sub">{m.days < 0 ? `${-m.days} dias atrasado` : `${m.days} dias`}</div>
                  </td>
                  <td>
                    <Tone tone={toneOf(m.status)}>{statusLabel(m.status)}</Tone>
                    <div className="sub">{m.note}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
