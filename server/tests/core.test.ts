import { describe, expect, it } from "vitest";
import { claimEvent } from "../src/core/idempotency";
import { evaluateSla } from "../src/core/sla";
import { agingBucket, receivableStatus } from "../src/core/receivable";
import { dueCollectionActions } from "../src/core/collection";
import { validateDelivery } from "../src/core/delivery";
import { advanceStep, createTimeline } from "../src/core/timeline";
import { SinkERPProvider } from "../src/providers/erp";
import { WhatsAppProvider } from "../src/providers/messaging";
import { TrayAdapter } from "../src/providers/tray";

const noon = new Date(2026, 8, 22, 12, 0, 0);

describe("idempotency", () => {
  it("rejects the same tray order event twice", () => {
    const store = new Set<string>();
    expect(claimEvent(store, "tray", "1582", "order.upsert").accepted).toBe(true);
    expect(claimEvent(store, "tray", "1582", "order.upsert").accepted).toBe(false);
  });
});

describe("sla", () => {
  it("raises alert when invoicing exceeds configured minutes", () => {
    const alert = evaluateSla(
      { code: "INVOICING", status: "running", startedAt: new Date("2026-09-22T07:00:00") },
      { id: "r1", fromStep: "ERP_INTEGRATED", toStep: "INVOICING", slaMinutes: 240, severity: "WARNING", active: true },
      noon,
    );
    expect(alert?.severity).toBe("WARNING");
    expect(alert?.overdueMinutes).toBe(60);
  });

  it("does not hardcode SLA when rule is inactive", () => {
    const alert = evaluateSla(
      { code: "INVOICING", status: "running", startedAt: new Date("2026-09-21T08:00:00") },
      { id: "r1", fromStep: "ERP_INTEGRATED", toStep: "INVOICING", slaMinutes: 10, severity: "CRITICAL", active: false },
      noon,
    );
    expect(alert).toBeNull();
  });
});

describe("receivable + collection", () => {
  it("classifies aging buckets", () => {
    expect(receivableStatus({ dueDate: new Date(2026, 8, 22), now: noon })).toBe("DUE_TODAY");
    expect(agingBucket(new Date(2026, 8, 15), noon)).toBe("overdue_4_7");
  });

  it("does not send again after payment or duplicate rule", () => {
    const rules = [
      { id: "d0", offsetDays: 0, channel: "whatsapp" as const, template: "due_today", audience: "customer" as const, priority: 1, active: true, hourFrom: 8, hourTo: 20 },
    ];
    expect(dueCollectionActions({ dueDate: new Date(2026, 8, 22), paid: true, rules, alreadySentRuleIds: [], now: noon })).toEqual([]);
    expect(dueCollectionActions({ dueDate: new Date(2026, 8, 22), rules, alreadySentRuleIds: ["d0"], now: noon })).toEqual([]);
    expect(dueCollectionActions({ dueDate: new Date(2026, 8, 22), rules, alreadySentRuleIds: [], now: noon })[0]?.id).toBe("d0");
  });
});

describe("delivery + timeline", () => {
  it("blocks shipment without required slot", () => {
    const r = validateDelivery({ requireSlot: true, hourFrom: 8, hourTo: 17, weekDays: [1, 2, 3, 4, 5] }, {});
    expect(r.ok).toBe(false);
    expect(r.errors[0]).toMatch(/agendamento/);
  });

  it("creates and advances order timeline", () => {
    const steps = createTimeline("tray", { ORDER_RECEIVED: 10 });
    const next = advanceStep(steps, "ORDER_RECEIVED", noon);
    expect(next[0].status).toBe("done");
    expect(next[1].status).toBe("running");
  });
});

describe("providers stay disconnected without docs/credentials", () => {
  it("does not invent SINK endpoints", async () => {
    const sink = new SinkERPProvider({});
    const r = await sink.syncOrder({ externalId: "1", number: "1582", total: 10 });
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/SINK_API_DOCS_MISSING/);
  });

  it("does not send WhatsApp without credentials", async () => {
    const wa = new WhatsAppProvider({});
    const r = await wa.sendTemplate({ to: "55", template: "due_today", params: {} });
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/WHATSAPP_NOT_CONFIGURED/);
  });

  it("maps Tray payload without calling the live API", () => {
    const tray = new TrayAdapter({});
    expect(tray.mapOrder({ id: 1582, total: 99 }).externalId).toBe("1582");
    expect(tray.verifyWebhook(undefined, "{}").ok).toBe(false);
  });
});
