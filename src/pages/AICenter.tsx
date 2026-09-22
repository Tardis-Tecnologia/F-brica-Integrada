import { useState } from "react";
import { useData } from "../state/DataContext";
import { Panel } from "../components/ui";
import { Check, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export function AICenter() {
  const { recs, applyRec } = useData();
  const [open, setOpen] = useState(recs[0]?.id ?? "");

  return (
    <div className="stack">
      <div className="ai-hero">
        <p className="kicker">Cruzamento ativo</p>
        <h2>A IA já leu vendas, estoque, BOM e compras.</h2>
        <p>
          Não é um chatbot genérico: cada cartão abaixo nasce do mesmo cenário da
          FLIND que você vê no dashboard. A compra de filme PE abre a
          comparação de fornecedores — preço, prazo, qualidade e risco de ruptura.
        </p>
      </div>

      <div className="ai-grid">
        {recs.map((r) => {
          const expanded = open === r.id;
          return (
            <Panel key={r.id} className={`ai-card ${r.priority} ${r.applied ? "done" : ""}`} pad={false}>
              <button className="ai-head" onClick={() => setOpen(expanded ? "" : r.id)}>
                <div>
                  <span className={`prio ${r.priority}`}>{r.priority} prioridade</span>
                  <h3>{r.title}</h3>
                </div>
                <ChevronRight className={expanded ? "rot" : ""} size={18} />
              </button>
              {expanded ? (
                <div className="ai-body">
                  <Block label="Problema identificado" text={r.problem} />
                  <div>
                    <p className="kicker">Dados utilizados</p>
                    <ul className="data-used">
                      {r.dataUsed.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                  </div>
                  <Block label="Recomendação" text={r.recommendation} />
                  <Block label="Impacto esperado" text={r.impact} />
                  <div className="ai-actions">
                    {r.actionKind === "compra" ? (
                      <Link className="primary" to="/app/compras">
                        Abrir Compras Inteligentes
                      </Link>
                    ) : (
                      <button
                        className="primary"
                        disabled={r.applied}
                        onClick={() => applyRec(r.id)}
                      >
                        {r.applied ? (
                          <>
                            <Check size={16} /> Ação registrada
                          </>
                        ) : (
                          r.action
                        )}
                      </button>
                    )}
                    <span className="hint">
                      {r.actionKind === "compra"
                        ? "Compara cadastro, catálogo, B2B e API — não só o menor preço"
                        : "Simulação de envio ao sistema de origem"}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="ai-preview">{r.problem}</p>
              )}
            </Panel>
          );
        })}
      </div>
    </div>
  );
}

function Block({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="kicker">{label}</p>
      <p>{text}</p>
    </div>
  );
}
