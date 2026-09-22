import { useMemo, useState } from "react";
import { buyFlow, futureChannels, needSeeds, purchaseHistory } from "../data/purchases";
import { useData } from "../state/DataContext";
import { coverLabel, money, pct, qty } from "../lib/format";
import {
  liveQty,
  pickByMode,
  quotesFor,
  rankQuotes,
  ruptureDaysOf,
  type CompareMode,
} from "../lib/purchases";
import { Panel, PanelHead, Tone } from "../components/ui";
import { Check, Sparkles } from "lucide-react";

const modes: { id: CompareMode; label: string }[] = [
  { id: "valor", label: "Melhor custo-benefício" },
  { id: "barato", label: "Mais barato" },
  { id: "qualidade", label: "Melhor qualidade" },
  { id: "rapido", label: "Entrega mais rápida" },
];

export function Purchases() {
  const { products, materials, orders, purchaseRequests, createPurchase } = useData();
  const [needId, setNeedId] = useState(needSeeds[0].id);
  const [mode, setMode] = useState<CompareMode>("valor");

  const needs = useMemo(
    () =>
      needSeeds.map((n) => {
        const m = materials.find((x) => x.id === n.materialId)!;
        const buy = liveQty(n.baseQty, n.materialId, products, orders);
        const rupture = ruptureDaysOf(m);
        return { ...n, material: m, buy, rupture };
      }),
    [materials, products, orders],
  );

  const selected = needs.find((n) => n.id === needId) ?? needs[0];
  const ranked = rankQuotes(quotesFor(selected.materialId), selected.buy, selected.rupture);
  const highlight = pickByMode(ranked, mode);
  const cheapest = ranked.find((r) => r.cheapest)!;
  const requested = purchaseRequests.find((p) => p.materialId === selected.materialId);

  const recommendCopy = buildCopy(selected.material.name, selected.buy, selected.rupture, ranked);

  return (
    <div className="stack">
      <p className="lead">
        A IA não escolhe o menor preço. Ela cruza prazo com a data de ruptura, qualidade,
        atraso histórico, frete e total — e recomenda a compra que não para a planta.
      </p>

      <Panel className="flow-panel">
        <PanelHead kicker="Fluxo de compras" title="Da venda à melhor ordem de compra" />
        <div className="flow">
          {buyFlow.map((s, i) => (
            <div key={s.n} className="flow-step">
              <span>{s.n}</span>
              <strong>{s.title}</strong>
              <small>{s.source}</small>
              {i < buyFlow.length - 1 ? <i /> : null}
            </div>
          ))}
        </div>
      </Panel>

      <div className="split-buy">
        <Panel pad={false}>
          <div className="pad">
            <PanelHead kicker="Detectado pela IA" title="Necessidades de compra" />
          </div>
          <div className="need-list">
            {needs.map((n) => (
              <button
                key={n.id}
                className={`need-card ${n.id === selected.id ? "on" : ""} ${n.priority}`}
                onClick={() => setNeedId(n.id)}
              >
                <div className="need-top">
                  <Tone tone={n.priority === "alta" ? "critico" : "atencao"}>{n.priority}</Tone>
                  {requested && n.id === selected.id ? <span className="hint">SC aberta</span> : null}
                </div>
                <h3>{n.material.name}</h3>
                <p>
                  Comprar {qty(n.buy)} {n.material.unit} · ruptura em{" "}
                  {n.rupture.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} dias
                </p>
                <small>
                  Saldo {qty(n.material.stock)} {n.material.unit} · mín. {qty(n.material.minStock)}
                </small>
              </button>
            ))}
          </div>
        </Panel>

        <div className="stack">
          <div className="kpi-grid four">
            <article className="kpi">
              <p className="kpi-label">Estoque atual</p>
              <p className="kpi-value">
                {qty(selected.material.stock)}
                <small className="unit"> {selected.material.unit}</small>
              </p>
              <p className="hint">{coverLabel(selected.material.stock, selected.material.avgDaily)}</p>
            </article>
            <article className="kpi">
              <p className="kpi-label">Estoque mínimo</p>
              <p className="kpi-value">
                {qty(selected.material.minStock)}
                <small className="unit"> {selected.material.unit}</small>
              </p>
              <p className="hint">ponto de reposição</p>
            </article>
            <article className="kpi">
              <p className="kpi-label">Qtd. recomendada</p>
              <p className="kpi-value">
                {qty(selected.buy)}
                <small className="unit"> {selected.material.unit}</small>
              </p>
              <p className="hint">7 dias + campanha + BOM</p>
            </article>
            <article className="kpi">
              <p className="kpi-label">Previsão de ruptura</p>
              <p className="kpi-value">
                {selected.rupture.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}
                <small className="unit"> d</small>
              </p>
              <p className="hint">consumo {qty(selected.material.avgDaily)} {selected.material.unit}/dia</p>
            </article>
          </div>

          <Panel>
            <p className="kicker">Leitura da IA</p>
            <p className="insight">{selected.insight}</p>
            <ul className="data-used">
              {selected.drivers.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>

      <div className="filter-row">
        {modes.map((m) => (
          <button key={m.id} className={`chip ${mode === m.id ? "on" : ""}`} onClick={() => setMode(m.id)}>
            {m.label}
          </button>
        ))}
        <span className="hint">{ranked.length} fornecedores encontrados · origem mista</span>
      </div>

      <div className="vendor-grid">
        {ranked.map((r) => {
          const active = r.quote.id === highlight.quote.id;
          return (
            <article
              key={r.quote.id}
              className={`panel pad vendor ${active ? "active" : ""} ${r.bestValue ? "value" : ""}`}
            >
              <div className="vendor-top">
                <p className="kicker">{r.quote.origin}</p>
                <div className="tag-row">
                  {r.bestValue ? <span className="tag cyan">Custo-benefício</span> : null}
                  {r.cheapest ? <span className="tag brass">Mais barato</span> : null}
                  {r.quality ? <span className="tag green">Qualidade</span> : null}
                  {r.fastest ? <span className="tag">Mais rápido</span> : null}
                </div>
              </div>
              <h3>{r.quote.supplierName}</h3>
              <p className="muted">{r.quote.city}</p>
              <dl className="spec">
                <div>
                  <dt>Preço unitário</dt>
                  <dd>{money(r.quote.unitPrice, true)}</dd>
                </div>
                <div>
                  <dt>Prazo</dt>
                  <dd>
                    {r.quote.leadDays} {r.quote.leadDays === 1 ? "dia" : "dias"}
                  </dd>
                </div>
                <div>
                  <dt>Qualidade</dt>
                  <dd>{r.quote.quality.toLocaleString("pt-BR")} / 5</dd>
                </div>
                <div>
                  <dt>Disponível</dt>
                  <dd>
                    {qty(r.quote.available)} {selected.material.unit}
                  </dd>
                </div>
                <div>
                  <dt>Atraso</dt>
                  <dd>{pct(r.quote.delayRate)}</dd>
                </div>
                <div>
                  <dt>Devoluções</dt>
                  <dd>{pct(r.quote.returnRate)}</dd>
                </div>
                <div>
                  <dt>Pagamento</dt>
                  <dd>{r.quote.payment}</dd>
                </div>
                <div>
                  <dt>Frete</dt>
                  <dd>{money(r.quote.freight)}</dd>
                </div>
              </dl>
              <div className="vendor-total">
                <span>Total da compra</span>
                <b>{money(r.total)}</b>
              </div>
            </article>
          );
        })}
      </div>

      <div className="ai-buy">
        <div>
          <p className="kicker">
            <Sparkles size={12} /> Recomendação da IA · {modes.find((m) => m.id === mode)?.label}
          </p>
          <h3>
            {mode === "valor" ? "Melhor custo-benefício" : modes.find((m) => m.id === mode)?.label}:{" "}
            {highlight.quote.supplierName}
          </h3>
          <p>{mode === "valor" ? recommendCopy.body : altCopy(mode, highlight, cheapest, selected.buy)}</p>
          <p className="hint">
            Economia vs. fornecedor atual Lanxess / cadastro: o motor usa total com frete, não só o unitário.
            Delta vs. mais barato: {money(highlight.total - cheapest.total, true)}.
          </p>
        </div>
        <button
          className="primary"
          disabled={!!requested}
          onClick={() =>
            createPurchase({
              materialId: selected.materialId,
              materialName: selected.material.name,
              quoteId: highlight.quote.id,
              supplierName: highlight.quote.supplierName,
              qty: selected.buy,
              total: highlight.total,
              leadDays: highlight.quote.leadDays,
            })
          }
        >
          {requested ? (
            <>
              <Check size={16} /> {requested.id} gerada
            </>
          ) : (
            "Gerar solicitação de compra"
          )}
        </button>
      </div>

      <div className="split-2">
        <Panel>
          <PanelHead kicker="Versão definitiva" title="Onde a busca de fornecedores vai chegar" />
          <div className="capa-grid">
            {futureChannels.map((c) => (
              <article key={c.id} className={`capa ${c.now ? "now" : ""}`}>
                <span className={`tone ${c.now ? "tone-ok" : "tone-info"}`}>
                  {c.now ? "Ativo no protótipo" : "Versão definitiva"}
                </span>
                <h4>{c.title}</h4>
                <p>{c.detail}</p>
              </article>
            ))}
          </div>
        </Panel>
        <Panel pad={false}>
          <div className="pad">
            <PanelHead kicker="Histórico" title="Compras recentes da planta" />
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>SC</th>
                  <th>Insumo</th>
                  <th>Fornecedor</th>
                  <th>Qtd</th>
                  <th>Total</th>
                  <th>Prazo</th>
                </tr>
              </thead>
              <tbody>
                {purchaseRequests.map((p) => (
                  <tr key={p.id} className="row-good">
                    <td className="mono">{p.id}</td>
                    <td>{p.materialName}</td>
                    <td>{p.supplierName}</td>
                    <td>{qty(p.qty)} kg</td>
                    <td>{money(p.total)}</td>
                    <td>
                      <Tone tone="info">Nova · {p.leadDays}d</Tone>
                    </td>
                  </tr>
                ))}
                {purchaseHistory.map((p) => (
                  <tr key={p.id}>
                    <td className="mono">{p.id}</td>
                    <td>{p.material}</td>
                    <td>{p.supplier}</td>
                    <td>{qty(p.qty)} kg</td>
                    <td>{money(p.total)}</td>
                    <td>
                      <Tone tone={p.onTime ? "ok" : "atencao"}>{p.onTime ? "No prazo" : "Atrasou"}</Tone>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function buildCopy(
  name: string,
  buy: number,
  rupture: number,
  ranked: ReturnType<typeof rankQuotes>,
) {
  const value = ranked.find((r) => r.bestValue)!;
  const cheap = ranked.find((r) => r.cheapest)!;
  const delta = value.total - cheap.total;
  const days = rupture.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
  return {
    body: `Apesar de custar ${money(delta, true)} a mais que ${cheap.quote.supplierName} (a opção mais barata), ${value.quote.supplierName} tem qualidade ${value.quote.quality.toLocaleString("pt-BR")}/5 e entrega em ${value.quote.leadDays} dias — antes da ruptura de ${days} dias do ${name}. A opção mais barata chega em ${cheap.quote.leadDays} dias e deixaria a produção sem insumo. Índice de atraso ${pct(value.quote.delayRate)} vs. ${pct(cheap.quote.delayRate)}. Volume: ${qty(buy)} kg.`,
  };
}

function altCopy(
  mode: CompareMode,
  highlight: ReturnType<typeof pickByMode>,
  cheapest: ReturnType<typeof pickByMode>,
  buy: number,
) {
  if (mode === "barato") {
    return `${highlight.quote.supplierName} oferece o menor total (${money(highlight.total)}) para ${qty(buy)} kg. O lead time de ${highlight.quote.leadDays} dias e o atraso histórico de ${pct(highlight.quote.delayRate)} precisam ser lidos contra a data de ruptura — por isso a IA não recomenda esta opção como padrão.`;
  }
  if (mode === "qualidade") {
    return `${highlight.quote.supplierName} lidera qualidade (${highlight.quote.quality.toLocaleString("pt-BR")}/5) e tem ${pct(highlight.quote.returnRate)} de devolução. Custo total ${money(highlight.total)}.`;
  }
  if (mode === "rapido") {
    return `${highlight.quote.supplierName} entrega em ${highlight.quote.leadDays} ${highlight.quote.leadDays === 1 ? "dia" : "dias"}. É a âncora contra parada de linha, com total ${money(highlight.total)} — ${money(highlight.total - cheapest.total, true)} acima do menor preço.`;
  }
  return "";
}
