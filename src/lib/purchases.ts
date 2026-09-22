import { quotes, type Quote } from "../data/purchases";
import type { Material, Product, ProductionOrder } from "../data/mock";
import { daysCover } from "./format";

export const seedOrderIds = new Set([
  "OP-2412",
  "OP-2411",
  "OP-2410",
  "OP-2408",
  "OP-2406",
  "OP-2404",
  "OP-2401",
  "OP-2398",
]);

export type CompareMode = "valor" | "barato" | "qualidade" | "rapido";

export function quoteTotal(q: Quote, qty: number) {
  return q.unitPrice * qty + q.freight;
}

export function extraBomQty(
  materialId: string,
  products: Product[],
  orders: ProductionOrder[],
) {
  let extra = 0;
  for (const o of orders) {
    if (seedOrderIds.has(o.id)) continue;
    const p = products.find((x) => x.id === o.productId);
    const line = p?.bom.find((b) => b.materialId === materialId);
    if (line) extra += line.qty * o.qty;
  }
  return extra;
}

export function liveQty(base: number, materialId: string, products: Product[], orders: ProductionOrder[]) {
  const extra = extraBomQty(materialId, products, orders);
  return Math.ceil((base + extra) / 10) * 10;
}

export function quotesFor(materialId: string) {
  return quotes.filter((q) => q.materialId === materialId);
}

export function rankQuotes(list: Quote[], qty: number, ruptureDays: number) {
  const totals = list.map((q) => quoteTotal(q, qty));
  const cheapest = Math.min(...totals);
  const fastest = Math.min(...list.map((q) => q.leadDays));
  const bestQuality = Math.max(...list.map((q) => q.quality));

  const scored = list.map((q, i) => {
    const total = totals[i];
    const onTime = q.leadDays <= ruptureDays ? 1 : 0.2;
    const priceNorm = cheapest / total;
    const qualityNorm = q.quality / 5;
    const reliability = 1 - q.delayRate / 100;
    const value =
      onTime * 0.35 + priceNorm * 0.25 + qualityNorm * 0.25 + reliability * 0.15;
    return {
      quote: q,
      total,
      value,
      cheapest: total === cheapest,
      fastest: q.leadDays === fastest,
      quality: q.quality === bestQuality,
    };
  });

  const bestValueId = scored.reduce((a, b) => (a.value >= b.value ? a : b)).quote.id;
  return scored.map((s) => ({ ...s, bestValue: s.quote.id === bestValueId }));
}

export function pickByMode(
  ranked: ReturnType<typeof rankQuotes>,
  mode: CompareMode,
) {
  if (mode === "barato") return ranked.find((r) => r.cheapest) ?? ranked[0];
  if (mode === "qualidade") return ranked.find((r) => r.quality) ?? ranked[0];
  if (mode === "rapido") return ranked.find((r) => r.fastest) ?? ranked[0];
  return ranked.find((r) => r.bestValue) ?? ranked[0];
}

export function ruptureDaysOf(m: Material) {
  return daysCover(m.stock, m.avgDaily);
}
