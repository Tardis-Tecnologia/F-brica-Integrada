import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useState } from "react";
import { channelMix, flowSteps, revenueSeries } from "../data/mock";
import { agingBucket, agingLabels, payments, shipments } from "../data/commerce";
import { useData } from "../state/DataContext";
import { coverLabel, money, pct, qty, toneByCover } from "../lib/format";
import { Kpi, Panel, PanelHead, Tone } from "../components/ui";
import { ArrowRight } from "lucide-react";

const pieColors = ["#C4A35A", "#3EE0C4", "#6EA8D8", "#8B9BAB"];

export function Dashboard() {
  const { products, materials, recs, alerts, kpis, livePulse } = useData();
  const crit = products.filter(
    (p) => toneByCover(p.stock, p.minStock, p.avgDaily) !== "ok",
  );
  const pig = materials.find((m) => m.id === "pig-preto");

  return (
    <div className="stack">
      <div className={`health ${livePulse ? "pulse" : ""}`}>
        <div>
          <p className="kicker">Situação geral da operação</p>
          <h3>Atenção operacional · índice 72/100</h3>
          <p>
            Vendas seguem firmes, mas o Produto A tem cobertura de{" "}
            {coverLabel(products[0].stock, products[0].avgDaily)}
            {pig
              ? ` e o pigmento preto cobre ${coverLabel(pig.stock, pig.avgDaily)}`
              : ""}
            . A Linha 2 pressiona a margem. A IA já cruzou produção e fornecedores.
          </p>
        </div>
        <div className="health-meters">
          <Meter label="Demanda" value={86} tone="ok" />
          <Meter label="Estoque" value={54} tone="warn" />
          <Meter label="Produção" value={74} tone="ok" />
          <Meter label="Custo" value={61} tone="warn" />
        </div>
      </div>

      <OpsBoard />

      <div className="kpi-grid">
        <Kpi label="Faturamento" value={money(kpis.revenue)} delta="+8,4% MTD" deltaTone="up" hint="vs. mês anterior" />
        <Kpi label="Pedidos" value={qty(kpis.orders)} delta="+126 hoje" deltaTone="up" hint="4 canais ativos" />
        <Kpi label="Produção" value={`${qty(kpis.produced)} un`} delta="OEE 74,2%" deltaTone="warn" hint="3 linhas" />
        <Kpi label="Estoque" value={money(kpis.stockValue)} delta={`${crit.length} itens críticos`} deltaTone="down" hint="PA + insumos" />
        <Kpi label="Custos" value={money(kpis.costs)} delta="+3,1% por refugo" deltaTone="down" hint="custo industrial" />
        <Kpi label="Margem" value={pct(kpis.margin)} delta="−3,3 p.p." deltaTone="down" hint="era 36,1%" />
        <Kpi label="Desperdício" value={pct(kpis.waste)} delta="Linha 2 +14%" deltaTone="down" hint="7 dias" />
        <Kpi label="Estoque crítico" value={`${crit.length} produtos`} delta="A e E abaixo do mín." deltaTone="warn" hint="ação na Central de IA" />
      </div>

      <Panel className={`flow-panel ${livePulse ? "pulse" : ""}`}>
        <PanelHead
          kicker="Fluxo da plataforma"
          title="Da venda à recomendação — o cruzamento que o gestor não faz na planilha"
        />
        <div className="flow">
          {flowSteps.map((s, i) => (
            <div key={s.n} className="flow-step">
              <span>{s.n}</span>
              <strong>{s.title}</strong>
              <small>{s.source}</small>
              {i < flowSteps.length - 1 ? <i /> : null}
            </div>
          ))}
        </div>
      </Panel>

      <div className="split-2">
        <Panel>
          <PanelHead kicker="14 dias" title="Receita × custo industrial" extra={<span className="hint">R$ mil</span>} />
          <div className="chart-lg">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries}>
                <defs>
                  <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C4A35A" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#C4A35A" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gC" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3EE0C4" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#3EE0C4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#24313c" vertical={false} />
                <XAxis dataKey="day" stroke="#8b9bab" fontSize={11} tickLine={false} />
                <YAxis stroke="#8b9bab" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tip} />
                <Area type="monotone" dataKey="receita" stroke="#C4A35A" fill="url(#gR)" strokeWidth={2} />
                <Area type="monotone" dataKey="custo" stroke="#3EE0C4" fill="url(#gC)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel>
          <PanelHead kicker="Origem" title="Mix de canais de venda" />
          <div className="chart-mix">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={channelMix} dataKey="value" innerRadius={58} outerRadius={84} paddingAngle={3}>
                  {channelMix.map((e, i) => (
                    <Cell key={e.name} fill={pieColors[i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tip} />
              </PieChart>
            </ResponsiveContainer>
            <ul className="legend">
              {channelMix.map((c, i) => (
                <li key={c.name}>
                  <i style={{ background: pieColors[i] }} />
                  {c.name}
                  <b>{c.value}%</b>
                </li>
              ))}
            </ul>
          </div>
        </Panel>
      </div>

      <div className="split-3">
        <Panel>
          <PanelHead
            kicker="Ruptura"
            title="Produtos com estoque crítico"
            extra={
              <Link className="text-link" to="/app/estoque">
                Estoque <ArrowRight size={14} />
              </Link>
            }
          />
          <table className="dense">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Saldo</th>
                <th>Cobertura</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const tone = toneByCover(p.stock, p.minStock, p.avgDaily);
                return (
                  <tr key={p.id} className={tone === "critico" ? "row-hot" : ""}>
                    <td>
                      <b>{p.alias}</b>
                      <div className="sub">{p.name}</div>
                    </td>
                    <td>{qty(p.stock)}</td>
                    <td>{coverLabel(p.stock, p.avgDaily)}</td>
                    <td>
                      <Tone tone={tone}>
                        {tone === "critico" ? "Crítico" : tone === "atencao" ? "Atenção" : "Estável"}
                      </Tone>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Panel>

        <Panel>
          <PanelHead
            kicker="Motor analítico"
            title="Recomendações da IA"
            extra={
              <span className="filter-row">
                <Link className="text-link" to="/app/compras">
                  Compras <ArrowRight size={14} />
                </Link>
                <Link className="text-link" to="/app/ia">
                  Central <ArrowRight size={14} />
                </Link>
              </span>
            }
          />
          <div className="rec-list">
            {recs.slice(0, 3).map((r) => (
              <article key={r.id} className={`mini-rec ${r.priority}`}>
                <Tone tone={r.priority === "alta" ? "critico" : "atencao"}>{r.priority}</Tone>
                <h4>{r.title}</h4>
                <p>{r.impact}</p>
              </article>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHead kicker="Tempo real" title="Alertas recentes" />
          <div className="alert-list">
            {alerts.slice(0, 5).map((a) => (
              <article key={a.id} className="alert-row">
                <span className={`dot ${a.tone}`} />
                <div>
                  <strong>{a.title}</strong>
                  <p>{a.detail}</p>
                  <small>
                    {a.time} · {a.source}
                  </small>
                </div>
              </article>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

type Drill = { title: string; rows: { id: string; text: string; extra: string; to: string }[] };

function OpsBoard() {
  const { sales, alerts } = useData();
  const [drill, setDrill] = useState<Drill | null>(null);
  const overduePay = payments.filter((p) => p.status === "Vencido");
  const paid = payments.filter((p) => p.status === "Pago");
  const groups = [
    {
      title: "Pedidos",
      items: [
        { label: "Novos", n: sales.filter((s) => s.status === "Novo").length, to: "/app/vendas", rows: sales.filter((s) => s.status === "Novo").map((s) => ({ id: s.id, text: `${s.origin} · ${s.status}`, extra: money(s.value), to: "/app/vendas" })) },
        { label: "Processando", n: sales.filter((s) => s.status === "Em separação").length, to: "/app/vendas", rows: sales.filter((s) => s.status === "Em separação").map((s) => ({ id: s.id, text: s.origin, extra: s.status, to: "/app/vendas" })) },
        { label: "Faturados", n: sales.filter((s) => s.status === "Faturado").length, to: "/app/vendas", rows: sales.filter((s) => s.status === "Faturado").map((s) => ({ id: s.id, text: s.origin, extra: money(s.value), to: "/app/vendas" })) },
        { label: "Aguardando expedição", n: shipments.filter((s) => s.stage === "Separação" || s.stage === "Etiqueta").length, to: "/app/rastreio", rows: shipments.filter((s) => s.stage === "Separação" || s.stage === "Etiqueta").map((s) => ({ id: s.id, text: s.client, extra: s.stage, to: `/app/rastreio?q=${s.id}` })) },
        { label: "Atrasados", n: sales.filter((s) => s.status === "Atrasado").length, to: "/app/vendas", rows: sales.filter((s) => s.status === "Atrasado").map((s) => ({ id: s.id, text: s.origin, extra: s.status, to: "/app/vendas" })) },
        { label: "Entregues", n: sales.filter((s) => s.status === "Entregue").length, to: "/app/vendas", rows: sales.filter((s) => s.status === "Entregue").slice(0, 6).map((s) => ({ id: s.id, text: s.origin, extra: money(s.value), to: "/app/vendas" })) },
      ],
    },
    {
      title: "Financeiro",
      items: [
        { label: "A vencer", n: payments.filter((p) => agingBucket(p) === "upcoming").length, to: "/app/cobrancas?bucket=upcoming", rows: payments.filter((p) => agingBucket(p) === "upcoming").map((p) => ({ id: p.id, text: p.client, extra: money(p.value), to: "/app/cobrancas?bucket=upcoming" })) },
        { label: "Vence hoje", n: payments.filter((p) => agingBucket(p) === "due_today").length, to: "/app/cobrancas?bucket=due_today", rows: payments.filter((p) => agingBucket(p) === "due_today").map((p) => ({ id: p.id, text: p.client, extra: money(p.value), to: "/app/cobrancas?bucket=due_today" })) },
        { label: "Vencidos", n: overduePay.length, to: "/app/cobrancas?bucket=overdue", rows: overduePay.map((p) => ({ id: p.id, text: `${p.client} · ${agingLabels[agingBucket(p)]}`, extra: money(p.value), to: "/app/cobrancas?bucket=overdue" })) },
        { label: "Recebidos", n: paid.length, to: "/app/cobrancas?bucket=paid", rows: paid.map((p) => ({ id: p.id, text: p.client, extra: money(p.value), to: "/app/cobrancas?bucket=paid" })) },
        { label: "Em atraso", n: money(overduePay.reduce((a, p) => a + p.value, 0)), to: "/app/cobrancas?bucket=overdue", rows: overduePay.map((p) => ({ id: p.id, text: p.client, extra: money(p.value), to: "/app/cobrancas?bucket=overdue" })) },
      ],
    },
    {
      title: "Logística",
      items: [
        { label: "Aguardando expedição", n: shipments.filter((s) => ["Pedido", "NF-e / ERP", "Separação", "Etiqueta"].includes(s.stage)).length, to: "/app/rastreio", rows: shipments.filter((s) => ["Pedido", "NF-e / ERP", "Separação", "Etiqueta"].includes(s.stage)).map((s) => ({ id: s.id, text: s.client, extra: s.stage, to: `/app/rastreio?q=${s.id}` })) },
        { label: "Em transporte", n: shipments.filter((s) => s.stage === "Trânsito" || s.stage === "Coleta").length, to: "/app/rastreio", rows: shipments.filter((s) => s.stage === "Trânsito" || s.stage === "Coleta").map((s) => ({ id: s.id, text: s.carrier, extra: s.tracking, to: `/app/rastreio?q=${s.id}` })) },
        { label: "Entregues", n: shipments.filter((s) => s.stage === "Entrega").length, to: "/app/rastreio", rows: shipments.filter((s) => s.stage === "Entrega").map((s) => ({ id: s.id, text: s.client, extra: "Entrega", to: `/app/rastreio?q=${s.id}` })) },
        { label: "Ocorrências", n: shipments.filter((s) => s.delayHours > 0).length, to: "/app/rastreio", rows: shipments.filter((s) => s.delayHours > 0).map((s) => ({ id: s.id, text: s.note, extra: `+${s.delayHours} h`, to: `/app/rastreio?q=${s.id}` })) },
        { label: "Entregas atrasadas", n: shipments.filter((s) => s.delayHours >= 8).length, to: "/app/rastreio", rows: shipments.filter((s) => s.delayHours >= 8).map((s) => ({ id: s.id, text: s.client, extra: `+${s.delayHours} h`, to: `/app/rastreio?q=${s.id}` })) },
      ],
    },
    {
      title: "Alertas",
      items: [
        { label: "Críticos", n: alerts.filter((a) => a.tone === "critico").length, to: "/app", rows: alerts.filter((a) => a.tone === "critico").map((a) => ({ id: a.id, text: a.title, extra: a.time, to: "/app" })) },
        { label: "Warnings", n: alerts.filter((a) => a.tone === "atencao").length, to: "/app", rows: alerts.filter((a) => a.tone === "atencao").map((a) => ({ id: a.id, text: a.title, extra: a.time, to: "/app" })) },
        { label: "Pendentes", n: alerts.filter((a) => a.tone !== "ok").length, to: "/app", rows: alerts.filter((a) => a.tone !== "ok").slice(0, 6).map((a) => ({ id: a.id, text: a.title, extra: a.source, to: "/app" })) },
        { label: "Resolvidos", n: alerts.filter((a) => a.tone === "ok").length, to: "/app", rows: alerts.filter((a) => a.tone === "ok").map((a) => ({ id: a.id, text: a.title, extra: a.time, to: "/app" })) },
      ],
    },
  ];

  return (
    <Panel>
      <PanelHead
        kicker="Dashboard operacional"
        title="Clique no número para ver os registros (dados de protótipo)"
        extra={drill ? <button className="chip" onClick={() => setDrill(null)}>Fechar lista</button> : null}
      />
      <div className="ops-grid">
        {groups.map((g) => (
          <div key={g.title} className="ops-col">
            <p className="kicker">{g.title}</p>
            {g.items.map((it) => (
              <button
                key={it.label}
                className="ops-item"
                onClick={() => setDrill({ title: `${g.title} · ${it.label}`, rows: it.rows })}
              >
                <span>{it.label}</span>
                <b>{it.n}</b>
              </button>
            ))}
          </div>
        ))}
      </div>
      {drill ? (
        <div className="ops-drill">
          <p className="kicker">{drill.title}</p>
          {drill.rows.length === 0 ? (
            <p className="hint">Nenhum registro neste recorte.</p>
          ) : (
            <ul>
              {drill.rows.map((r) => (
                <li key={r.id}>
                  <Link to={r.to}>
                    <b>{r.id}</b>
                    <span>{r.text}</span>
                    <em>{r.extra}</em>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </Panel>
  );
}

function Meter({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "ok" | "warn";
}) {
  return (
    <div className="meter">
      <div className="meter-top">
        <span>{label}</span>
        <b>{value}</b>
      </div>
      <div className="meter-bar">
        <span className={tone} style={{ width: `${value}%` }} />
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
