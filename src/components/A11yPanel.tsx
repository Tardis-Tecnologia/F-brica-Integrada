import { useEffect, useRef } from "react";
import { Accessibility } from "lucide-react";
import { useA11y } from "../state/A11yContext";
import { pageSpeech, speak, stopSpeak } from "../lib/speech";

export function A11yPanel({ title, subtitle }: { title: string; subtitle: string }) {
  const { contrast, large, speakAlerts, open, setOpen, setContrast, setLarge, setSpeakAlerts } = useA11y();
  const box = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === "a" || e.key === "A")) {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  useEffect(() => {
    if (open) first.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, setOpen]);

  return (
    <div className="a11y-wrap" ref={box}>
      <button
        type="button"
        className={`a11y-btn ${open ? "on" : ""}`}
        aria-expanded={open}
        aria-controls="a11y-panel"
        onClick={() => setOpen(!open)}
      >
        <Accessibility size={16} aria-hidden />
        Acessibilidade
      </button>
      {open ? (
        <div className="a11y-panel" id="a11y-panel" role="dialog" aria-label="Acessibilidade">
          <p className="kicker">PCD · teclado e leitura</p>
          <h2>Usar sem mouse e sem voz</h2>
          <p className="fine">
            Pessoa cega: ligue a leitura dos alertas e use Tab. Pessoa muda: tudo é clique ou texto — nenhuma ação pede voz.
            Atalho Alt + A. Escape fecha.
          </p>
          <label className="a11y-row">
            <input
              ref={first}
              type="checkbox"
              checked={contrast}
              onChange={(e) => setContrast(e.target.checked)}
            />
            Alto contraste
          </label>
          <label className="a11y-row">
            <input type="checkbox" checked={large} onChange={(e) => setLarge(e.target.checked)} />
            Texto maior
          </label>
          <label className="a11y-row">
            <input
              type="checkbox"
              checked={speakAlerts}
              onChange={(e) => setSpeakAlerts(e.target.checked)}
            />
            Ler alertas em voz alta
          </label>
          <div className="a11y-actions">
            <button
              type="button"
              className="secondary"
              onClick={() => speak(pageSpeech(title, subtitle))}
            >
              Ler esta tela
            </button>
            <button type="button" className="ghost-btn" onClick={() => stopSpeak()}>
              Parar leitura
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
