import { useData } from "../state/DataContext";
import { coverLabel, daysCover, money, qty, toneByCover } from "../lib/format";
import { Panel, PanelHead, Tone } from "../components/ui";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { catalogItems, lotRows } from "../data/opsExtra";

const segments = ["Todos", "Hospitalar", "Profissional", "Ferida"] as const;

export function Inventory() {
  const { products, materials } = useData();
  const [seg, setSeg] = useState<(typeof segments)[number]>("Todos");
  const catalog = catalogItems.filter((c) => seg === "Todos" || c.segment === seg);

  return (
    <div className="stack">
      <p className="lead">
        Produto acabado e insumos no mesmo quadro. Reservado some do saldo real —
        a NF-e ainda não. Catálogo por segmento, foto, NCM, caixa e peso. Tray só
        sobe o que justifica o frete.
      </p>
      <Panel pad={false}>
        <div className="pad">
          <PanelHead kicker="Produto acabado" title="Itens de venda e cobertura" />
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Produto</th>
                <th>Qtd atual</th>
                <th>Mínimo</th>
                <th>Consumo médio</th>
                <th>Duração</th>
                <th>Linha</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const tone = toneByCover(p.stock, p.minStock, p.avgDaily);
                const cover = daysCover(p.stock, p.avgDaily);
                return (
                  <tr key={p.id} className={tone === "critico" ? "row-hot" : tone === "atencao" ? "row-warm" : ""}>
                    <td className="mono">{p.sku}</td>
                    <td>
                      <b>
                        {p.alias} · {p.name}
                      </b>
                      <div className="sub">{p.family}</div>
                    </td>
                    <td>{qty(p.stock)} un</td>
                    <td>{qty(p.minStock)}</td>
                    <td>{qty(p.avgDaily)} / dia</td>
                    <td>
                      <div className="cover-cell">
                        <b>{coverLabel(p.stock, p.avgDaily)}</b>
                        <span className="mini-bar">
                          <i
                            className={tone}
                            style={{ width: `${Math.min(100, (cover / 20) * 100)}%` }}
                          />
                        </span>
                      </div>
                    </td>
                    <td>
                      {p.line}
                      <div className="sub">
                        piso {money(p.unitCost, true)} · até onde negociar {money(p.unitCost * 1.15, true)}
                      </div>
                    </td>
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
        </div>
      </Panel>

      <Panel pad={false}>
        <div className="pad">
          <PanelHead
            kicker="Lote, caixa e validade"
            title="O que o hospital pergunta na hora — e a regra dos 85%"
          />
          <p className="fine">
            Cliente hospitalar só recebe lote com pelo menos 85% da vida útil. Abaixo disso, carta de
            compromisso de troca. Caixa fechada — não fracionar.
          </p>
        </div>
        <div className="table-wrap">
          <table className="dense">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Lote</th>
                <th>Fab. / val.</th>
                <th>Vida útil</th>
                <th>Cx</th>
                <th>Reservado</th>
                <th>Margem</th>
              </tr>
            </thead>
            <tbody>
              {lotRows.map((l) => {
                const p = products.find((x) => x.id === l.productId);
                const short = l.lifeLeftPct < l.hospitalMin;
                return (
                  <tr key={l.lot} className={short ? "row-hot" : ""}>
                    <td>
                      <b>{p?.alias}</b>
                      <div className="sub">{p?.name}</div>
                    </td>
                    <td className="mono">{l.lot}</td>
                    <td>
                      {l.mfg}
                      <div className="sub">val. {l.exp} · {l.shelfYears} ano{l.shelfYears > 1 ? "s" : ""}</div>
                    </td>
                    <td>
                      <Tone tone={short ? "critico" : "ok"}>{l.lifeLeftPct}%</Tone>
                      <div className="sub">{short ? `abaixo de ${l.hospitalMin}% · carta de troca` : `ok para hospital (≥ ${l.hospitalMin}%)`}</div>
                    </td>
                    <td>{l.boxQty} un/cx</td>
                    <td>
                      {l.reserved ? `${l.reserved} p/ entrega` : "—"}
                      <div className="sub">saldo real {qty((p?.stock ?? 0) - l.reserved)}</div>
                    </td>
                    <td>{l.marginPct}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel>
        <PanelHead kicker="Catálogo segmentado" title="Foto, ficha, NCM, caixa e o que sobe na Tray" />
        <div className="filter-row" style={{ marginBottom: 12 }}>
          {segments.map((s) => (
            <button key={s} className={`chip ${seg === s ? "on" : ""}`} type="button" onClick={() => setSeg(s)}>
              {s}
            </button>
          ))}
        </div>
        <div className="vendor-grid">
          {catalog.map((c) => {
            const p = products.find((x) => x.id === c.productId);
            return (
              <article key={c.productId} className="panel pad vendor">
                <p className="kicker">{c.segment}</p>
                <h3>{p?.alias}</h3>
                <p className="fine">{c.photo}</p>
                <p className="fine">{c.tech}</p>
                <p className="fine">NCM {c.ncm} · {c.boxQty} un/cx · {c.weightKg} kg</p>
                <Tone tone={c.tray ? "ok" : "atencao"}>{c.tray ? "Tray" : "Fora da Tray"}</Tone>
                <p className="fine">{c.trayWhy}</p>
              </article>
            );
          })}
        </div>
      </Panel>

      <Panel pad={false}>
        <div className="pad">
            <PanelHead
              kicker="BOM / Compras"
              title="Insumos disponíveis para nova produção"
              extra={
                <Link className="text-link" to="/app/compras">
                  Compras IA <ArrowRight size={14} />
                </Link>
              }
            />
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Insumo</th>
                <th>Qtd atual</th>
                <th>Mínimo</th>
                <th>Consumo médio</th>
                <th>Duração</th>
                <th>Custo</th>
                <th>Fornecedor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((m) => {
                const tone = toneByCover(m.stock, m.minStock, m.avgDaily);
                return (
                  <tr key={m.id} className={tone === "critico" ? "row-hot" : tone === "atencao" ? "row-warm" : ""}>
                    <td className="mono">{m.sku}</td>
                    <td>
                      <b>{m.name}</b>
                    </td>
                    <td>
                      {qty(m.stock)} {m.unit}
                    </td>
                    <td>{qty(m.minStock)}</td>
                    <td>
                      {qty(m.avgDaily)} {m.unit}/dia
                    </td>
                    <td>{coverLabel(m.stock, m.avgDaily)}</td>
                    <td>{money(m.unitCost, true)}/{m.unit}</td>
                    <td>{m.supplier}</td>
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
        </div>
      </Panel>
    </div>
  );
}
