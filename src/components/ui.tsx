import type { ReactNode } from "react";
import type { StatusTone } from "../data/mock";

export function Panel({
  children,
  className = "",
  pad = true,
}: {
  children: ReactNode;
  className?: string;
  pad?: boolean;
}) {
  return <section className={`panel ${pad ? "pad" : ""} ${className}`}>{children}</section>;
}

export function PanelHead({
  kicker,
  title,
  extra,
}: {
  kicker?: string;
  title: string;
  extra?: ReactNode;
}) {
  return (
    <div className="panel-head">
      <div>
        {kicker ? <p className="kicker">{kicker}</p> : null}
        <h2>{title}</h2>
      </div>
      {extra}
    </div>
  );
}

export function Tone({ tone, children }: { tone: StatusTone | string; children: ReactNode }) {
  return <span className={`tone tone-${tone}`}>{children}</span>;
}

export function Kpi({
  label,
  value,
  delta,
  deltaTone,
  hint,
}: {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: "up" | "down" | "warn";
  hint?: string;
}) {
  return (
    <article className="kpi">
      <p className="kpi-label">{label}</p>
      <p className="kpi-value">{value}</p>
      <div className="kpi-foot">
        {delta ? <span className={`delta ${deltaTone ?? ""}`}>{delta}</span> : <span />}
        {hint ? <span className="hint">{hint}</span> : null}
      </div>
    </article>
  );
}

export function productById<T extends { id: string }>(list: T[], id: string) {
  return list.find((p) => p.id === id)!;
}
