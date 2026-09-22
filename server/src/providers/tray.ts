export type TrayOrderPayload = {
  id: string | number;
  status?: string;
  total?: number;
  customer?: { id?: string | number; name?: string; document?: string };
};

export class TrayAdapter {
  configured: boolean;
  constructor(private env: { url?: string; token?: string; webhookSecret?: string }) {
    this.configured = Boolean(env.url && env.token);
  }

  verifyWebhook(signature: string | undefined, rawBody: string) {
    if (!this.env.webhookSecret) return { ok: false, error: "TRAY_WEBHOOK_SECRET ausente" };
    if (!signature) return { ok: false, error: "assinatura ausente" };
    void rawBody;
    return { ok: signature === `sha256=${this.env.webhookSecret}` };
  }

  mapOrder(payload: TrayOrderPayload) {
    return {
      source: "tray",
      externalId: String(payload.id),
      status: payload.status ?? "open",
      total: Number(payload.total ?? 0),
      customerName: payload.customer?.name ?? "Cliente Tray",
      customerDocument: String(payload.customer?.document ?? ""),
    };
  }
}
