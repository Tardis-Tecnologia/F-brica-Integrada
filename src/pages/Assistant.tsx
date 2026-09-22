import { FormEvent, useRef, useState } from "react";
import { answerQuestion, chips } from "../lib/assistant";
import { useData } from "../state/DataContext";
import { Send } from "lucide-react";
import { Logo } from "../components/Sidebar";

type Msg = { role: "user" | "ai"; title?: string; text: string };

export function Assistant() {
  const { products, materials } = useData();
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "ai",
      title: "Assistente da planta Joinville",
      text: "Posso responder com os dados desta demonstração. Pergunte sobre produção, estoque, compras, fornecedores ou margem.",
    },
  ]);
  const [q, setQ] = useState("");
  const scroller = useRef<HTMLDivElement>(null);

  const ask = (text: string) => {
    const t = text.trim();
    if (!t) return;
    const a = answerQuestion(t, products, materials);
    setMsgs((m) => [...m, { role: "user", text: t }, { role: "ai", title: a.title, text: a.body }]);
    setQ("");
    window.setTimeout(() => {
      scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
    }, 40);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    ask(q);
  };

  return (
    <div className="chat-shell">
      <aside className="chat-side">
        <p className="kicker">Perguntas da apresentação</p>
        {chips.map((c) => (
          <button key={c} className="chip block" onClick={() => ask(c)}>
            {c}
          </button>
        ))}
        <p className="fine">
          Respostas simuladas, mas amarradas ao estoque, custos e ordens que estão
          nas outras telas — inclusive se você simular uma venda.
        </p>
      </aside>
      <section className="chat">
        <div className="chat-log" ref={scroller}>
          {msgs.map((m, i) => (
            <article key={i} className={`bubble ${m.role}`}>
              {m.role === "ai" ? <Logo size={28} /> : <span className="you">MC</span>}
              <div>
                {m.title ? <h4>{m.title}</h4> : null}
                <p>{m.text}</p>
              </div>
            </article>
          ))}
        </div>
        <form className="chat-form" onSubmit={onSubmit}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Pergunte à operação… ex.: por que minha margem caiu?"
          />
          <button className="icon-send" type="submit" aria-label="Enviar">
            <Send size={16} />
          </button>
        </form>
      </section>
    </div>
  );
}
