import { useMemo, useState } from "react";
import { useData } from "../state/DataContext";
import { money, qty } from "../lib/format";
import { Panel, PanelHead, Tone, productById } from "../components/ui";
import { orderSteps, shipDeals } from "../data/opsExtra";

const channels = ["Todos", "E-commerce", "ERP", "Licitação", "Representante"] as const;

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

      <Panel className="flow-panel">
        <PanelHead kicker="Como o pedido anda" title="Cliente pede → tem estoque? → compra se falta → vendeu × a pagar" />
        <div className="flow">
          {orderSteps.map((s, i) => (
            <div key={s.n} className="flow-step">
              <span>{s.n}</span>
              <strong>{s.title}</strong>
              <small>{s.source}</small>
              {i < orderSteps.length - 1 ? <i /> : null}
            </div>
          ))}
        </div>
      </Panel>

      <div className="split-4 mini-stats">
        <Stat n="E-commerce" d="Loja Tray flind.com.br · pedido já baixa estoque e dispara o SINK" />
        <Stat n="ERP" d="SINK ERP · NF-e, boleto PagBank e B2B hospitalar" />
        <Stat n="Licitação" d="Comprasnet e SISMICAT · hospitais e forças armadas" />
        <Stat n="Representante" d="Clínicas, obras e aviação" />
      </div>

      <Panel pad={false}>
        <div className="pad">
          <PanelHead kicker="Livro de pedidos" title="Vendas simuladas da FLIND" />
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

      <Panel pad={false}>
        <div className="pad">
          <PanelHead
            kicker="Frete e CNPJ"
            title="Sede ≠ unidade de entrega · quem paga o frete · fila de amanhã vs 5 dias"
          />
          <p className="fine">
            Grupo hospitalar fatura num CNPJ e recebe em outro. Frete entra como % da venda.
            Confirma hoje, sai amanhã. Atrasa, vai para o fim da fila.
          </p>
        </div>
        <div className="table-wrap">
          <table className="dense">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Fatura</th>
                <th>Entrega</th>
                <th>Frete</th>
                <th>Prazo</th>
                <th>Preço travado</th>
              </tr>
            </thead>
            <tbody>
              {shipDeals.map((d) => (
                <tr key={d.id}>
                  <td><b>{d.client}</b></td>
                  <td>{d.hq}</td>
                  <td>{d.shipTo}</td>
                  <td>
                    {d.freightPct.toLocaleString("pt-BR")}% da venda
                    <div className="sub">{d.freightPayer}</div>
                  </td>
                  <td>{d.sla}</td>
                  <td className="muted">{d.hold}</td>
                </tr>
              ))}
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
