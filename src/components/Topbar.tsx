import { Menu, Radio, Sparkles } from "lucide-react";
import { company, useData } from "../state/DataContext";
import { todayLabel } from "../lib/format";
import { useEffect, useState } from "react";
import { A11yPanel } from "./A11yPanel";

export function Topbar({
  title,
  subtitle,
  onMenu,
}: {
  title: string;
  subtitle: string;
  onMenu: () => void;
}) {
  const { simulateSale, livePulse } = useData();
  const [clock, setClock] = useState(() =>
    new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
  );

  useEffect(() => {
    const t = window.setInterval(() => {
      setClock(
        new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    }, 1000);
    return () => window.clearInterval(t);
  }, []);

  return (
    <header className="topbar">
      <button className="icon-btn menu-btn" onClick={onMenu} aria-label="Menu">
        <Menu size={18} />
      </button>
      <div className="topbar-title">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="topbar-meta">
        <span className={`live ${livePulse ? "pulse" : ""}`}>
          <Radio size={14} />
          Fluxo ao vivo
        </span>
        <span className="meta-pill">{company.plant}</span>
        <span className="meta-pill mono">{todayLabel()} · {clock}</span>
        <A11yPanel title={title} subtitle={subtitle} />
        <button className="demo-btn" onClick={simulateSale}>
          <Sparkles size={15} aria-hidden />
          Simular venda e-commerce
        </button>
        <div className="avatar" title={company.manager}>
          CS
        </div>
      </div>
    </header>
  );
}
