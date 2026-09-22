import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMemo, useState } from "react";
import { channelMix, flowSteps, revenueSeries } from "../data/mock";
import { agingBucket, agingLabels, payments, shipments } from "../data/commerce";
import { cycleFlag } from "../data/crm";
import { lotRows } from "../data/opsExtra";
import { useData } from "../state/DataContext";
import { coverLabel, daysCover, money, qty, toneByCover } from "../lib/format";
import { Kpi, Panel, PanelHead, Tone } from "../components/ui";
import { ArrowRight } from "lucide-react";

const pieColors = ["#1e1e59", "#0d3d73", "#9e0039", "#969696"];

function parseBr(d: string) {
  const [dd, mm, yyyy] = d.split("/").map(Number);
  return new Date(yyyy, mm - 1, dd);
}

function daysUntil(exp: string) {
  const ms = parseBr(exp).getTime() - new Date(2026, 8, 22).getTime();
  return Math.round(ms / 86_400_000);
}

export function Dashboard() {
  const { products, materials, recs, alerts, kpis, livePulse, sales } = useData();
  const crit = products.filter(
    (p) => toneByCover(p.stock, p.minStock, p.avgDaily) !== "ok",
  );
  const pig = materials.find((m) => m.id === "pig-preto");

  const movers = useMemo(() => {
    return products
      .map((p) => {
        const rows = sales.filter((s) => s.productId === p.id);
        const units = rows.reduce((a, s) => a + s.qty, 0);
        const value = rows.reduce((a, s) => a + s.value, 0);
        return { ...p, units, value, cover: daysCover(p.stock, p.avgDaily) };
      })
      .sort((a, b) => b.units - a.units);
  }, [products, sales]);

  const expiring = useMemo(
    () =>
      [...lotRows]
        .map((l) => ({
          ...l,
          product: products.find((p) => p.id === l.productId),
          days: daysUntil(l.exp),
        }))
        .sort((a, b) => a.lifeLeftPct - b.lifeLeftPct),
    [products],
  );

  const emptying = useMemo(
    () =>
      [...products].sort(
        (a, b) => daysCover(a.stock, a.avgDaily) - daysCover(b.stock, b.avgDaily),
      ),
    [products],
  );

  const top = movers[0];
  const nextLot = expiring[0];
  const firstOut = emptying[0];
  const below85 = expiring.filter((l) => l.lifeLeftPct < l.hospitalMin).length;

  return (
    <div className="stack">
      <div className={`health ${livePulse ? "pulse" : ""}`}>
        <div>
          <p className="kicker">Situação geral da operação</p>
          <h3>Atenção operacional · índice 72/100</h3>
          <p>
            A loja Tray segue firme, mas o Toalet 10 tem cobertura de{" "}
            {coverLabel(products[0].stock, products[0].avgDaily)}
            {pig
              ? ` e o filme PE cobre ${coverLabel(pig.stock, pig.avgDaily)}`
              : ""}
            . Quem mais sai agora é o {top?.alias}. {nextLot?.product?.alias} está com {nextLot?.lifeLeftPct}% de vida útil
            — hospital pede 85%. FGTS e AVCB vencidos.
          </p>
        </div>
        <div className="health-meters">
          <Meter label="Demanda" value={86} tone="ok" />
          <Meter label="Estoque" value={54} tone="warn" />
          <Meter label="Entrega" value={78} tone="ok" />
          <Meter label="Caixa" value={71} tone="warn" />
        </div>
      </div>

      <OpsBoard />

      <div className="kpi-grid">
        <Kpi label="Faturamento" value={money(kpis.revenue)} delta="+8,4% MTD" deltaTone="up" hint="vs. mês anterior" />
        <Kpi label="Pedidos" value={qty(kpis.orders)} delta="+126 hoje" deltaTone="up" hint="4 canais ativos" />
        <Kpi label="Estoque" value={money(kpis.stockValue)} delta={`${crit.length} itens críticos`} deltaTone="down" hint="PA + insumos" />
        <Kpi label="Estoque crítico" value={`${crit.length} produtos`} delta="A e E abaixo do mín." deltaTone="warn" hint="ação na Central de IA" />
      </div>

      <div className="kpi-grid four">
        <Kpi
          label="Mais sai"
          value={top?.alias ?? "—"}
          delta={`${qty(top?.units ?? 0)} un no livro`}
          deltaTone="up"
          hint={`${money(top?.value ?? 0)} · ${top?.avgDaily} / dia`}
        />
        <Kpi
          label="Validade mais curta"
          value={nextLot?.product?.alias ?? "—"}
          delta={`${nextLot?.lifeLeftPct}% de vida · lote ${nextLot?.lot}`}
          deltaTone="down"
          hint={`${nextLot?.shelfYears} ano${(nextLot?.shelfYears ?? 1) > 1 ? "s" : ""} de prateleira`}
        />
        <Kpi
          label="Acaba primeiro"
          value={firstOut?.alias ?? "—"}
          delta={coverLabel(firstOut?.stock ?? 0, firstOut?.avgDaily ?? 1)}
          deltaTone="down"
          hint={`${qty(firstOut?.avgDaily ?? 0)} un/dia`}
        />
        <Kpi
          label="Lote < 85%"
          value={`${below85}`}
          delta="carta de troca no hospital"
          deltaTone="warn"
          hint="regra de vida útil"
        />
      </div>

      <div className="split-3">
        <Panel>
          <PanelHead
            kicker="Giro"
            title="Quais produtos saem mais"
            extra={
              <Link className="text-link" to="/app/vendas">
                Vendas <ArrowRight size={14} />
              </Link>
            }
          />
          <p className="fine">Soma do livro de pedidos desta demonstração + ritmo diário.</p>
          <div className="chart-md">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={movers} layout="vertical" margin={{ left: 8, right: 8 }}>
                <CartesianGrid stroke="#e5e5e5" horizontal={false} />
                <XAxis type="number" stroke="#64605f" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="alias" stroke="#64605f" fontSize={12} width={78} tickLine={false} />
                <Tooltip contentStyle={tip} />
                <Bar dataKey="units" fill="#1e1e59" radius={4} name="Unidades" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="table-wrap">
            <table className="dense">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Saiu</th>
                  <th>/ dia</th>
                  <th>R$</th>
                </tr>
              </thead>
              <tbody>
                {movers.map((p, i) => (
                  <tr key={p.id} className={i === 0 ? "row-good" : ""}>
                    <td>
                      <b>{p.alias}</b>
                      <div className="sub">{i === 0 ? "líder de saída" : p.family}</div>
                    </td>
                    <td>{qty(p.units)}</td>
                    <td>{qty(p.avgDaily)}</td>
                    <td>{money(p.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel>
          <PanelHead
            kicker="Validade"
            title="O que vence / perde vida útil primeiro"
            extra={
              <Link className="text-link" to="/app/estoque">
                Lotes <ArrowRight size={14} />
              </Link>
            }
          />
          <p className="fine">Hospital só recebe lote com 85% da vida. Abaixo disso, carta de troca.</p>
          <div className="table-wrap">
            <table className="dense">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Vida</th>
                  <th>Validade</th>
                </tr>
              </thead>
              <tbody>
                {expiring.map((l) => {
                  const short = l.lifeLeftPct < l.hospitalMin;
                  return (
                    <tr key={l.lot} className={short ? "row-hot" : ""}>
                      <td>
                        <b>{l.product?.alias}</b>
                        <div className="sub">{l.lot} · {l.shelfYears} ano{l.shelfYears > 1 ? "s" : ""}</div>
                      </td>
                      <td>
                        <Tone tone={short ? "critico" : "ok"}>{l.lifeLeftPct}%</Tone>
                        <div className="sub">{short ? `abaixo de ${l.hospitalMin}%` : `ok ≥ ${l.hospitalMin}%`}</div>
                      </td>
                      <td>
                        {l.exp}
                        <div className="sub">{l.days} dias</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel>
          <PanelHead
            kicker="Cobertura"
            title="O que acaba no estoque mais rápido"
            extra={
              <Link className="text-link" to="/app/estoque">
                Estoque <ArrowRight size={14} />
              </Link>
            }
          />
          <p className="fine">Saldo ÷ consumo médio do dia. Quanto menor, mais perto da ruptura.</p>
          <div className="table-wrap">
            <table className="dense">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Saldo</th>
                  <th>Duração</th>
                </tr>
              </thead>
              <tbody>
                {emptying.map((p) => {
                  const tone = toneByCover(p.stock, p.minStock, p.avgDaily);
                  const cover = daysCover(p.stock, p.avgDaily);
                  return (
                    <tr key={p.id} className={tone === "critico" ? "row-hot" : tone === "atencao" ? "row-warm" : ""}>
                      <td>
                        <b>{p.alias}</b>
                        <div className="sub">{qty(p.avgDaily)} / dia</div>
                      </td>
                      <td>{qty(p.stock)}</td>
                      <td>
                        <b>{coverLabel(p.stock, p.avgDaily)}</b>
                        <span className="mini-bar">
                          <i className={tone} style={{ width: `${Math.min(100, (cover / 20) * 100)}%` }} />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
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
          <PanelHead kicker="14 dias" title="Receita da loja e do B2B" extra={<span className="hint">R$ mil</span>} />
          <div className="chart-lg">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries}>
                <defs>
                  <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1e1e59" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#1e1e59" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e5e5e5" vertical={false} />
                <XAxis dataKey="day" stroke="#64605f" fontSize={11} tickLine={false} />
                <YAxis stroke="#64605f" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tip} />
                <Area type="monotone" dataKey="receita" stroke="#1e1e59" fill="url(#gR)" strokeWidth={2} />
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
  const { sales, alerts, certificates, machines, accounts } = useData();
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
      title: "Comercial",
      items: [
        { label: "Recompra agora", n: accounts.filter((a) => cycleFlag(a.lastBuyDays, a.cycleDays) !== "cedo").length, to: "/app/comercial", rows: accounts.filter((a) => cycleFlag(a.lastBuyDays, a.cycleDays) !== "cedo").map((a) => ({ id: a.id, text: `${a.name} · ${a.product}`, extra: `${a.cycleDays} d`, to: "/app/comercial" })) },
        { label: "Curva A", n: accounts.filter((a) => a.abc === "A").length, to: "/app/comercial", rows: accounts.filter((a) => a.abc === "A").map((a) => ({ id: a.id, text: a.name, extra: money(a.avgTicket), to: "/app/comercial" })) },
        { label: "WhatsApp / e-mail", n: "85%", to: "/app/comercial", rows: accounts.filter((a) => a.channel === "WhatsApp" || a.channel === "E-mail").map((a) => ({ id: a.id, text: a.name, extra: a.channel, to: "/app/comercial" })) },
      ],
    },
    {
      title: "Conformidade",
      items: [
        { label: "Certidões vencidas", n: certificates.filter((c) => c.status === "overdue").length, to: "/app/conformidade", rows: certificates.filter((c) => c.status === "overdue").map((c) => ({ id: c.id, text: c.name, extra: c.expires, to: "/app/conformidade" })) },
        { label: "A vencer", n: certificates.filter((c) => c.status === "soon" || c.status === "pending").length, to: "/app/conformidade", rows: certificates.filter((c) => c.status === "soon" || c.status === "pending").map((c) => ({ id: c.id, text: c.name, extra: `${c.days} dias`, to: "/app/conformidade" })) },
        { label: "Máquinas atrasadas", n: machines.filter((m) => m.status === "overdue").length, to: "/app/conformidade", rows: machines.filter((m) => m.status === "overdue").map((m) => ({ id: m.id, text: m.name, extra: m.nextService, to: "/app/conformidade" })) },
        { label: "Preventiva próxima", n: machines.filter((m) => m.status === "soon").length, to: "/app/conformidade", rows: machines.filter((m) => m.status === "soon").map((m) => ({ id: m.id, text: m.name, extra: m.nextService, to: "/app/conformidade" })) },
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
  background: "#ffffff",
  border: "1px solid #e5e5e5",
  borderRadius: 8,
  fontSize: 12,
  color: "#25282a",
};
