export const ORDER_STEPS = [
  "ORDER_RECEIVED",
  "ERP_INTEGRATED",
  "PICKING",
  "INVOICING",
  "NFE_ISSUED",
  "SHIPPING",
  "CARRIER",
  "IN_TRANSIT",
  "DELIVERED",
] as const;

export type OrderStepCode = (typeof ORDER_STEPS)[number];

export function createTimeline(origin: string, slaByStep: Record<string, number>) {
  return ORDER_STEPS.map((code) => ({
    code,
    status: code === "ORDER_RECEIVED" ? "running" : "pending",
    startedAt: code === "ORDER_RECEIVED" ? new Date() : null,
    finishedAt: null,
    origin,
    slaMinutes: slaByStep[code] ?? 0,
  }));
}

export function advanceStep(
  steps: { code: string; status: string; startedAt: Date | null; finishedAt: Date | null }[],
  code: string,
  now = new Date(),
) {
  const idx = steps.findIndex((s) => s.code === code);
  if (idx < 0) return steps;
  return steps.map((s, i) => {
    if (i === idx) return { ...s, status: "done", finishedAt: now };
    if (i === idx + 1) return { ...s, status: "running", startedAt: now };
    return s;
  });
}
