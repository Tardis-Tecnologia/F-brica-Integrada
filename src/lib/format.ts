const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const brlFine = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const num = new Intl.NumberFormat("pt-BR");

export function money(v: number, fine = false) {
  return (fine ? brlFine : brl).format(v);
}

export function qty(v: number, digits = 0) {
  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(v);
}

export function pct(v: number, digits = 1) {
  return `${v.toLocaleString("pt-BR", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })}%`;
}

export function daysCover(stock: number, avgDaily: number) {
  if (!avgDaily) return 99;
  return stock / avgDaily;
}

export function coverLabel(stock: number, avgDaily: number) {
  const d = daysCover(stock, avgDaily);
  if (d >= 20) return `${qty(d, 0)} dias`;
  return `${qty(d, 1)} dias`;
}

export function toneByCover(stock: number, minStock: number, avgDaily: number) {
  const d = daysCover(stock, avgDaily);
  if (stock < minStock || d <= 6) return "critico" as const;
  if (d <= 9) return "atencao" as const;
  return "ok" as const;
}

export function marginOf(price: number, cost: number) {
  return ((price - cost) / price) * 100;
}

export function nowClock() {
  return new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function todayLabel() {
  return new Date().toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export { num };
