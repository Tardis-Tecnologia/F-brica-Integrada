export type ErpCustomer = { externalId: string; name: string; document: string };
export type ErpProduct = { externalId: string; sku: string; name: string; stock?: number };
export type ErpOrder = { externalId: string; number: string; total: number };

export interface ERPProvider {
  name: string;
  configured: boolean;
  syncCustomer(customer: ErpCustomer): Promise<{ ok: boolean; externalId?: string; error?: string }>;
  syncProduct(product: ErpProduct): Promise<{ ok: boolean; externalId?: string; error?: string }>;
  syncOrder(order: ErpOrder): Promise<{ ok: boolean; externalId?: string; error?: string }>;
}

export class SinkERPProvider implements ERPProvider {
  name = "SINK";
  configured: boolean;

  constructor(private env: { url?: string; token?: string; docsAvailable?: boolean }) {
    this.configured = Boolean(env.url && env.token && env.docsAvailable);
  }

  private blocked() {
    return {
      ok: false,
      error:
        "SINK_API_DOCS_MISSING: nenhuma documentação oficial do SINK ERP no repositório. Endpoints não foram inventados. Preencha SINK_API_URL, SINK_API_TOKEN e SINK_API_DOCS_AVAILABLE=true após a doc oficial.",
    };
  }

  async syncCustomer(_customer: ErpCustomer) {
    return this.blocked();
  }
  async syncProduct(_product: ErpProduct) {
    return this.blocked();
  }
  async syncOrder(_order: ErpOrder) {
    return this.blocked();
  }
}
