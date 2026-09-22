import { cycleFlag, cycleLabel, leadsSeed, prospectMix, type Account } from "../data/crm";
import { Panel, PanelHead, Tone } from "../components/ui";
import { useData } from "../state/DataContext";
import { money } from "../lib/format";
import { Bell, Mail, MessageCircle } from "lucide-react";

function flagTone(a: Account) {
  const f = cycleFlag(a.lastBuyDays, a.cycleDays);
  if (f === "atrasado") return "critico" as const;
  if (f === "janela") return "atencao" as const;
  return "ok" as const;
}

export function Commercial() {
  const { accounts, fireRepurchase } = useData();
  const due = accounts.filter((a) => cycleFlag(a.lastBuyDays, a.cycleDays) !== "cedo");
  const abcA = accounts.filter((a) => a.abc === "A");

  return (
    <div className="stack">
      <p className="lead">
        O trabalho começa no cliente: WhatsApp, e-mail, Tray e plataformas de
        cotação. Telefone e visita quase não entram — 85% da prospecção é
        WhatsApp e e-mail. A curva ABC o sistema de vocês já tem. O que faltava
        é o acompanhamento: se o Hospital compra de 40 em 40 dias, a FI avisa o
        estoque dele e lembra o comercial de falar.
      </p>

      <div className="kpi-grid four">
        <article className="kpi">
          <p className="kpi-label">Na janela / atrasados</p>
          <p className="kpi-value">{due.length}</p>
          <p className="hint">ciclo de recompra agora</p>
        </article>
        <article className="kpi">
          <p className="kpi-label">Curva A</p>
          <p className="kpi-value">{abcA.length}</p>
          <p className="hint">concentram a receita</p>
        </article>
        <article className="kpi">
          <p className="kpi-label">WhatsApp + e-mail</p>
          <p className="kpi-value">85%</p>
          <p className="hint">prospecção real · sem visita</p>
        </article>
        <article className="kpi">
          <p className="kpi-label">Já alertados</p>
          <p className="kpi-value">{accounts.filter((a) => a.alerted).length}</p>
          <p className="hint">sem disparo duplicado</p>
        </article>
      </div>

      <div className="split-2">
        <Panel pad={false}>
          <div className="pad">
            <PanelHead kicker="Gestão de acompanhamento" title="Ciclo de recompra · ABC + cadência" />
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>ABC</th>
                  <th>Ciclo</th>
                  <th>Canal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((a) => {
                  const flag = cycleFlag(a.lastBuyDays, a.cycleDays);
                  return (
                    <tr key={a.id} className={flag === "atrasado" ? "row-hot" : flag === "janela" ? "row-warm" : ""}>
                      <td>
                        <b>{a.name}</b>
                        <div className="sub">
                          {a.product} · última {a.lastBuy} · {money(a.avgTicket)}
                        </div>
                      </td>
                      <td>
                        <Tone tone={a.abc === "A" ? "critico" : a.abc === "B" ? "atencao" : "info"}>{a.abc}</Tone>
                      </td>
                      <td>
                        <Tone tone={flagTone(a)}>{cycleLabel(flag)}</Tone>
                        <div className="sub">
                          a cada {a.cycleDays} d · há {a.lastBuyDays} d
                        </div>
                      </td>
                      <td>
                        {a.channel}
                        <div className="sub">{a.owner}</div>
                      </td>
                      <td>
                        {a.alerted ? (
                          <span className="hint">já disparado</span>
                        ) : flag === "cedo" ? (
                          <span className="hint">aguardar ciclo</span>
                        ) : (
                          <span className="filter-row">
                            <button className="chip" onClick={() => fireRepurchase(a.id, "whatsapp")}>
                              <MessageCircle size={14} /> Cliente
                            </button>
                            <button className="chip" onClick={() => fireRepurchase(a.id, "team")}>
                              <Bell size={14} /> Comercial
                            </button>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>

        <div className="stack">
          <Panel>
            <PanelHead kicker="Prospecção" title="Onde o trabalho começa · 85% digital" />
            <ul className="legend">
              {prospectMix.map((c) => (
                <li key={c.name}>
                  <i style={{ background: c.name === "WhatsApp" ? "#3dbe7a" : c.name === "E-mail" ? "#6ea8d8" : "#3d7ea6" }} />
                  {c.name}
                  <b>{c.value}%</b>
                </li>
              ))}
            </ul>
            <p className="fine">Telefone e visita ficam de fora da fila padrão. Quase ninguém atende.</p>
          </Panel>
          <Panel pad={false}>
            <div className="pad">
              <PanelHead kicker="Leads abertos" title="WhatsApp, e-mail, Tray e cotação" />
            </div>
            <div className="table-wrap">
              <table className="dense">
                <thead>
                  <tr>
                    <th>Lead</th>
                    <th>Origem</th>
                    <th>Fase</th>
                  </tr>
                </thead>
                <tbody>
                  {leadsSeed.map((l) => (
                    <tr key={l.id}>
                      <td>
                        <b>{l.name}</b>
                        <div className="sub">{l.note}</div>
                      </td>
                      <td>{l.origin}</td>
                      <td>
                        {l.stage}
                        <div className="sub">{l.ageDays} d · {l.owner}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      </div>

      <Panel>
        <PanelHead kicker="O que o disparo faz" title="Dois avisos, sem telefone" />
        <div className="capa-grid">
          <article className="capa now">
            <Mail size={16} />
            <h4>Cliente · estoque</h4>
            <p>WhatsApp ou e-mail: “vocês costumam repor o Toalet a cada 40 dias. Pelo nosso ritmo, o estoque do CME deve estar no fim. Quer a mesma quantidade?”</p>
          </article>
          <article className="capa now">
            <Bell size={16} />
            <h4>Comercial · lembrete</h4>
            <p>Fila da Renata/Diego: entrar em contato no canal que o cliente já usa. Sem ligar, sem agendar visita.</p>
          </article>
          <article className="capa now">
            <MessageCircle size={16} />
            <h4>Sem duplicar</h4>
            <p>O mesmo ciclo não dispara duas vezes. Pagamento ou pedido novo cancela o lembrete, como na cobrança.</p>
          </article>
        </div>
      </Panel>
    </div>
  );
}
