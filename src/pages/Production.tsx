import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useData } from "../state/DataContext";
import { money, pct, qty } from "../lib/format";
import { Panel, PanelHead, Tone, productById } from "../components/ui";
import { wasteByLine } from "../data/mock";

export function Production() {
  const { orders, products } = useData();
  const running = orders.filter((o) => o.status === "Em execução").length;

  return (
    <div className="stack">
      <div className="kpi-grid four">
        <article className="kpi">
          <p className="kpi-label">Ordens ativas</p>
          <p className="kpi-value">{running}</p>
          <p className="hint">em execução agora</p>
        </article>
        <article className="kpi">
          <p className="kpi-label">OEE planta</p>
          <p className="kpi-value">74,2%</p>
          <p className="hint">Linha Kit puxa para baixo</p>
        </article>
        <article className="kpi">
          <p className="kpi-label">Eficiência média</p>
          <p className="kpi-value">87%</p>
          <p className="hint">ordens concluídas</p>
        </article>
        <article className="kpi">
          <p className="kpi-label">Refugo Linha Kit</p>
          <p className="kpi-value">8,4%</p>
          <p className="hint">+14% em 7 dias</p>
        </article>
      </div>

      <div className="split-2">
        <Panel>
          <PanelHead kicker="Processo" title="Desperdício por linha" extra={<span className="hint">atual vs. 7 dias</span>} />
          <div className="chart-md">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wasteByLine}>
                <CartesianGrid stroke="#e5e5e5" vertical={false} />
                <XAxis dataKey="line" stroke="#64605f" fontSize={12} tickLine={false} />
                <YAxis stroke="#64605f" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tip} />
                <Bar dataKey="anterior" fill="#cccccc" radius={4} />
                <Bar dataKey="atual" fill="#1e1e59" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel>
          <PanelHead kicker="Leitura" title="O que a produção está dizendo" />
          <ul className="read-list">
            <li>
              <b>Linha Toalet</b> está saudável e tem capacidade para a campanha de
              1.200 kits 10 + suporte.
            </li>
            <li>
              <b>Linha Kit</b> sela a caixa 24 com desperdício alto. Acelerar volume
              agora aumenta custo unitário — qualidade da solda primeiro.
            </li>
            <li>
              <b>Linha EPI</b> concluiu máscara (OEE 86%) e tem luva em setup.
              Dá para ampliar OP-2406 para 700 caixas.
            </li>
          </ul>
        </Panel>
      </div>

      <Panel pad={false}>
        <div className="pad">
          <PanelHead kicker="MES" title="Ordens de produção" />
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ordem</th>
                <th>Produto</th>
                <th>Qtd</th>
                <th>Linha</th>
                <th>Status</th>
                <th>Custo</th>
                <th>Eficiência</th>
                <th>Desperdício</th>
                <th>Janela</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const p = productById(products, o.productId);
                const st =
                  o.status === "Atraso"
                    ? "critico"
                    : o.status === "Em execução"
                      ? "info"
                      : o.status === "Concluída"
                        ? "ok"
                        : "atencao";
                return (
                  <tr key={o.id} className={o.status === "Atraso" ? "row-hot" : ""}>
                    <td className="mono">{o.id}</td>
                    <td>
                      <b>
                        {p.alias} · {p.name}
                      </b>
                    </td>
                    <td>{qty(o.qty)}</td>
                    <td>{o.line}</td>
                    <td>
                      <Tone tone={st}>{o.status}</Tone>
                    </td>
                    <td>{money(o.cost)}</td>
                    <td>{o.efficiency ? pct(o.efficiency, 0) : "—"}</td>
                    <td>{o.wastePct ? pct(o.wastePct) : "—"}</td>
                    <td className="muted">
                      {o.start} → {o.due}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

const tip = {
  background: "#ffffff",
  border: "1px solid #e5e5e5",
  color: "#25282a",
  borderRadius: 8,
  fontSize: 12,
};
