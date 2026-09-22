import { useMemo, useState } from "react";
import { useData } from "../state/DataContext";
import { money, qty } from "../lib/format";
import { Panel, PanelHead, Tone, productById } from "../components/ui";

const channels = ["Todos", "E-commerce", "ERP", "Marketplace", "Representante"] as const;

export function Sales() {
  const { sales, products } = useData();
  const [ch, setCh] = useState<(typeof channels)[number]>("Todos");
  const list = useMemo(
    () => (ch === "Todos" ? sales : sales.filter((s) => s.channel === ch)),
    [sales, ch],
  );
  const total = list.reduce((a, s) => a + s.value, 0);

  return (
    <div className="stack">
      <div className="filter-row">
        {channels.map((c) => (
          <button key={c} className={`chip ${ch === c ? "on" : ""}`} onClick={() => setCh(c)}>
            {c}
          </button>
        ))}
        <span className="hint">
          {list.length} pedidos · {money(total)}
        </span>
      </div>

      <div className="split-4 mini-stats">
        <Stat n="E-commerce" d="Tray e Shopify · pedido já baixa estoque e dispara o SINK" />
        <Stat n="ERP" d="SINK ERP · NF-e, boleto e B2B (mock)" />
        <Stat n="Marketplace" d="Mercado Livre · demanda de tampa e conexão" />
        <Stat n="Representante" d="Portal B2B · flanges e tubos" />
      </div>

      <Panel pad={false}>
        <div className="pad">
          <PanelHead kicker="Livro de pedidos" title="Vendas simuladas da Atlas Polímeros" />
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Produto</th>
                <th>Qtd</th>
                <th>Canal</th>
                <th>Origem</th>
                <th>Valor</th>
                <th>Data</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {list.map((s) => {
                const p = productById(products, s.productId);
                return (
                  <tr key={s.id} className={s.status === "Novo" ? "row-hot" : ""}>
                    <td className="mono">{s.id}</td>
                    <td>
                      <b>
                        {p.alias} · {p.name}
                      </b>
                    </td>
                    <td>{qty(s.qty)}</td>
                    <td>{s.channel}</td>
                    <td className="muted">{s.origin}</td>
                    <td>{money(s.value, true)}</td>
                    <td className="mono">
                      {s.date.slice(8)}/{s.date.slice(5, 7)} · {s.time}
                    </td>
                    <td>
                      <Tone
                        tone={
                          s.status === "Atrasado"
                            ? "critico"
                            : s.status === "Novo"
                              ? "info"
                              : s.status === "Entregue"
                                ? "ok"
                                : "atencao"
                        }
                      >
                        {s.status}
                      </Tone>
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

function Stat({ n, d }: { n: string; d: string }) {
  return (
    <article className="panel pad compact">
      <p className="kicker">{n}</p>
      <p className="muted">{d}</p>
    </article>
  );
}
