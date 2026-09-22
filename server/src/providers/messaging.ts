export type MessageSend = {
  to: string;
  template: string;
  params: Record<string, string>;
};

export type MessageResult = {
  ok: boolean;
  providerMessageId?: string;
  error?: string;
};

export interface MessagingProvider {
  name: string;
  configured: boolean;
  sendTemplate(input: MessageSend): Promise<MessageResult>;
}

export class WhatsAppProvider implements MessagingProvider {
  name = "whatsapp";
  configured: boolean;

  constructor(private env: { token?: string; phoneNumberId?: string }) {
    this.configured = Boolean(env.token && env.phoneNumberId);
  }

  async sendTemplate(input: MessageSend): Promise<MessageResult> {
    if (!this.configured) {
      return {
        ok: false,
        error: "WHATSAPP_NOT_CONFIGURED: defina WHATSAPP_TOKEN e WHATSAPP_PHONE_NUMBER_ID. Sem mock de envio.",
      };
    }
    void input;
    return {
      ok: false,
      error: "WHATSAPP_LIVE_CALL_DISABLED: credenciais presentes, mas chamada real só após validação do template aprovado.",
    };
  }
}
