import { useData } from "../state/DataContext";
import { coverLabel, daysCover, money, qty, toneByCover } from "../lib/format";
import { Panel, PanelHead, Tone } from "../components/ui";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function Inventory() {
  const { products, materials } = useData();

  return (
    <div className="stack">
      <p className="lead">
        Produto acabado e insumos no mesmo quadro. Quando o e-commerce baixa o
        Produto A, a plataforma já verifica se há pigmento e resina para produzir de novo
        — e abre a necessidade em Compras Inteligentes.
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
                    <td>{p.line}</td>
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
