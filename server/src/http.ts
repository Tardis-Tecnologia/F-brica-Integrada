import express from "express";
import { claimEvent } from "./core/idempotency.js";
import { evaluateSla } from "./core/sla.js";
import { agingBucket, receivableStatus } from "./core/receivable.js";
import { dueCollectionActions } from "./core/collection.js";
import { validateDelivery } from "./core/delivery.js";
import { createTimeline } from "./core/timeline.js";
import { SinkERPProvider } from "./providers/erp.js";
import { WhatsAppProvider } from "./providers/messaging.js";
import { TrayAdapter } from "./providers/tray.js";

const seen = new Set<string>();

const defaultCollectionRules = [
  { id: "d-5", offsetDays: 5, channel: "internal" as const, template: "due_soon_internal", audience: "internal" as const, priority: 1, active: true, hourFrom: 8, hourTo: 20 },
  { id: "d-3", offsetDays: 3, channel: "whatsapp" as const, template: "due_soon", audience: "customer" as const, priority: 2, active: true, hourFrom: 8, hourTo: 20 },
  { id: "d0", offsetDays: 0, channel: "whatsapp" as const, template: "due_today", audience: "customer" as const, priority: 3, active: true, hourFrom: 8, hourTo: 20 },
  { id: "d1", offsetDays: -1, channel: "whatsapp" as const, template: "overdue", audience: "customer" as const, priority: 4, active: true, hourFrom: 8, hourTo: 20 },
];

export function createApp() {
  const app = express();
  app.use(express.json({ limit: "1mb" }));

  const tray = new TrayAdapter({
    url: process.env.TRAY_API_URL,
    token: process.env.TRAY_API_TOKEN,
    webhookSecret: process.env.TRAY_WEBHOOK_SECRET,
  });
  const sink = new SinkERPProvider({
    url: process.env.SINK_API_URL,
    token: process.env.SINK_API_TOKEN,
    docsAvailable: process.env.SINK_API_DOCS_AVAILABLE === "true",
  });
  const whatsapp = new WhatsAppProvider({
    token: process.env.WHATSAPP_TOKEN,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
  });

  app.get("/health", (_req, res) => {
    res.json({
      ok: true,
      layer: "fabrica-integrada-core",
      integrations: {
        tray: tray.configured ? "configured_not_live" : "missing_credentials",
        sink: sink.configured ? "configured_not_live" : "docs_or_credentials_missing",
        whatsapp: whatsapp.configured ? "configured_not_live" : "missing_credentials",
      },
    });
  });

  app.post("/webhooks/tray", (req, res) => {
    const raw = JSON.stringify(req.body ?? {});
    const verified = tray.verifyWebhook(req.header("x-tray-signature") ?? undefined, raw);
    if (!verified.ok) return res.status(401).json({ error: verified.error ?? "invalid_signature" });
    const mapped = tray.mapOrder(req.body as { id: string });
    const claim = claimEvent(seen, "tray", mapped.externalId, "order.upsert");
    if (!claim.accepted) return res.json({ ok: true, duplicate: true });
    const timeline = createTimeline("tray", { ORDER_RECEIVED: 10, ERP_INTEGRATED: 10, INVOICING: 240 });
    res.status(202).json({ ok: true, mapped, timeline, persistence: "in-memory-until-prisma-push" });
  });

  app.get("/webhooks/whatsapp", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
    if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN && challenge) {
      return res.status(200).send(String(challenge));
    }
    return res.status(403).send("forbidden");
  });

  app.post("/webhooks/whatsapp", (req, res) => {
    res.status(202).json({ ok: true, note: "status stored only after WHATSAPP_APP_SECRET validation is wired" , bodyType: typeof req.body });
  });

  app.post("/internal/sink/sync-order", async (req, res) => {
    const result = await sink.syncOrder(req.body);
    res.status(result.ok ? 200 : 501).json(result);
  });

  app.post("/internal/whatsapp/send", async (req, res) => {
    const result = await whatsapp.sendTemplate(req.body);
    res.status(result.ok ? 200 : 501).json(result);
  });

  app.post("/internal/rules/sla", (req, res) => {
    const out = evaluateSla(req.body.step, req.body.rule, req.body.now ? new Date(req.body.now) : new Date());
    res.json(out);
  });

  app.post("/internal/rules/delivery", (req, res) => {
    res.json(validateDelivery(req.body.rule, req.body.draft));
  });

  app.post("/internal/finance/status", (req, res) => {
    const dueDate = new Date(req.body.dueDate);
    const now = req.body.now ? new Date(req.body.now) : new Date();
    res.json({
      status: receivableStatus({ dueDate, paymentDate: req.body.paymentDate ? new Date(req.body.paymentDate) : null, cancelled: req.body.cancelled, now }),
      bucket: agingBucket(dueDate, now),
    });
  });

  app.post("/internal/finance/collection", (req, res) => {
    res.json(
      dueCollectionActions({
        dueDate: new Date(req.body.dueDate),
        paid: Boolean(req.body.paid),
        rules: req.body.rules ?? defaultCollectionRules,
        alreadySentRuleIds: req.body.alreadySentRuleIds ?? [],
        now: req.body.now ? new Date(req.body.now) : new Date(),
      }),
    );
  });

  return app;
}
