import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { costByProduct, revenueSeries } from "../data/mock";
import { Panel, PanelHead } from "../components/ui";
import { money, pct } from "../lib/format";

const marginImpact = costByProduct.map((p) => ({
  alias: p.alias,
  margem: ((p.preco - p.custo) / p.preco) * 100,
  perda: p.desperdicio * 1.4,
}));

export function Costs() {
  return (
    <div className="stack">
      <div className="kpi-grid four">
        <article className="kpi">
          <p className="kpi-label">Custo de produção MTD</p>
          <p className="kpi-value">{money(1241180)}</p>
          <p className="hint">+3,1% por refugo da Linha 2</p>
        </article>
        <article className="kpi">
          <p className="kpi-label">Custo médio / un</p>
          <p className="kpi-value">R$ 22,41</p>
          <p className="hint">mix da planta</p>
        </article>
        <article className="kpi">
          <p className="kpi-label">Desperdício no custo</p>
          <p className="kpi-value">R$ 59,6 mil</p>
          <p className="hint">últimos 14 dias</p>
        </article>
        <article className="kpi">
          <p className="kpi-label">Impacto na margem</p>
          <p className="kpi-value">−3,3 p.p.</p>
          <p className="hint">36,1% → 32,8%</p>
        </article>
      </div>

      <div className="split-2">
        <Panel>
          <PanelHead kicker="Evolução" title="Custo industrial e perda por refugo" />
          <div className="chart-lg">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries}>
                <defs>
                  <linearGradient id="gW" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E24B4A" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#E24B4A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#24313c" vertical={false} />
                <XAxis dataKey="day" stroke="#8b9bab" fontSize={11} tickLine={false} />
                <YAxis stroke="#8b9bab" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tip} />
                <Area type="monotone" dataKey="custo" stroke="#3EE0C4" fill="transparent" strokeWidth={2} />
                <Area type="monotone" dataKey="desperdicio" stroke="#E24B4A" fill="url(#gW)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel>
          <PanelHead kicker="Por SKU" title="Custo unitário vs. preço" />
          <div className="chart-lg">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costByProduct}>
                <CartesianGrid stroke="#24313c" vertical={false} />
                <XAxis dataKey="alias" stroke="#8b9bab" fontSize={12} tickLine={false} />
                <YAxis stroke="#8b9bab" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tip} />
                <Bar dataKey="preco" fill="#C4A35A" radius={4} />
                <Bar dataKey="custo" fill="#3EE0C4" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="split-2">
        <Panel pad={false}>
          <div className="pad">
            <PanelHead kicker="Detalhe" title="Custo por produto" />
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Preço</th>
                  <th>Custo</th>
                  <th>Margem</th>
                  <th>Desperdício</th>
                </tr>
              </thead>
              <tbody>
                {costByProduct.map((p) => (
                  <tr key={p.alias} className={p.alias === "B" ? "row-hot" : p.alias === "C" ? "row-good" : ""}>
                    <td>
                      <b>
                        {p.alias} · {p.name}
                      </b>
                    </td>
                    <td>{money(p.preco, true)}</td>
                    <td>{money(p.custo, true)}</td>
                    <td>{pct(((p.preco - p.custo) / p.preco) * 100)}</td>
                    <td>{pct(p.desperdicio)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
        <Panel>
          <PanelHead kicker="Leitura da IA" title="Como o desperdício fura a margem" />
          <div className="chart-md">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marginImpact} layout="vertical">
                <CartesianGrid stroke="#24313c" horizontal={false} />
                <XAxis type="number" stroke="#8b9bab" fontSize={11} />
                <YAxis type="category" dataKey="alias" stroke="#8b9bab" fontSize={12} width={28} />
                <Tooltip contentStyle={tip} />
                <Bar dataKey="margem" fill="#3EE0C4" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="callout">
            O Produto B tem volume alto e desperdício de 8,4%. Isso sozinho explica a
            maior parte da queda de 36,1% para 32,8% na margem da planta. O Produto C
            puxa para o outro lado: menor custo, menor perda, demanda em alta.
          </p>
        </Panel>
      </div>
    </div>
  );
}

const tip = {
  background: "#121a21",
  border: "1px solid #2a3a46",
  borderRadius: 8,
  fontSize: 12,
};
