export const trackStages = [
  "Pedido",
  "NF-e / ERP",
  "Separação",
  "Etiqueta",
  "Coleta",
  "Trânsito",
  "Entrega",
] as const;

export type TrackStage = (typeof trackStages)[number];

export type Shipment = {
  id: string;
  saleId: string;
  nfe: string;
  channel: "Tray" | "ERP" | "Marketplace";
  product: string;
  qty: number;
  client: string;
  cnpj: string;
  phone: string;
  billingAddress: string;
  deliveryAddress: string;
  carrier: string;
  tracking: string;
  stage: TrackStage;
  slaHours: number;
  delayHours: number;
  rules: string[];
  note: string;
  token: string;
  volumes: number;
  audit: { t: string; action: string; origin: string; actor: string }[];
};

export type Payment = {
  id: string;
  saleId: string;
  nfe: string;
  client: string;
  type: "Boleto" | "Fatura";
  value: number;
  due: string;
  days: number;
  status: "A vencer" | "Vence hoje" | "Vencido" | "Pago" | "Cancelado";
  audience: "interno" | "cliente";
  whatsapp: boolean;
};

export const slaRules = [
  { id: "sla-1", from: "Pedido recebido", to: "Integrado ao SINK", minutes: 10, severity: "CRITICAL" },
  { id: "sla-2", from: "Integrado ao SINK", to: "Faturamento", minutes: 240, severity: "WARNING" },
  { id: "sla-3", from: "Faturamento", to: "Expedição", minutes: 480, severity: "WARNING" },
  { id: "sla-4", from: "Expedição", to: "Entrega", minutes: 2880, severity: "INFO" },
];

export const collectionRules = [
  { id: "cr-d5", offset: -5, label: "D-5", channel: "Alerta interno", template: "Título {{numero}} vence em 5 dias", audience: "Financeiro", active: true, window: "8h–20h" },
  { id: "cr-d3", offset: -3, label: "D-3", channel: "WhatsApp", template: "Fatura {{numero}} vence em {{data}}", audience: "Cliente", active: true, window: "8h–20h" },
  { id: "cr-d1", offset: -1, label: "D-1", channel: "WhatsApp", template: "Lembrete: {{numero}} vence amanhã", audience: "Cliente", active: true, window: "8h–20h" },
  { id: "cr-d0", offset: 0, label: "D0", channel: "WhatsApp", template: "Vence hoje · {{dados_pagamento}}", audience: "Cliente", active: true, window: "8h–20h" },
  { id: "cr-p1", offset: 1, label: "D+1", channel: "WhatsApp", template: "Cobrança: {{numero}} venceu ontem", audience: "Cliente", active: true, window: "8h–20h" },
  { id: "cr-p3", offset: 3, label: "D+3", channel: "Alerta interno", template: "Financeiro: {{cliente}} em atraso", audience: "Financeiro", active: true, window: "8h–20h" },
  { id: "cr-p7", offset: 7, label: "D+7", channel: "Escalonamento", template: "Diretoria: título {{numero}} +7 dias", audience: "Gestão", active: true, window: "8h–18h" },
];

export function agingBucket(p: Payment) {
  if (p.status === "Pago") return "paid";
  if (p.status === "Cancelado") return "cancelled";
  if (p.days > 0) return "upcoming";
  if (p.days === 0) return "due_today";
  if (p.days >= -3) return "overdue_1_3";
  if (p.days >= -7) return "overdue_4_7";
  if (p.days >= -30) return "overdue_8_30";
  return "overdue_30_plus";
}

export const agingLabels: Record<string, string> = {
  upcoming: "A vencer",
  due_today: "Vence hoje",
  overdue_1_3: "1–3 dias atrasado",
  overdue_4_7: "4–7 dias atrasado",
  overdue_8_30: "8–30 dias atrasado",
  overdue_30_plus: "+30 dias atrasado",
  paid: "Recebido",
  cancelled: "Cancelado",
};

export const shipments: Shipment[] = [
  {
    id: "RT-2201",
    saleId: "VD-8843",
    nfe: "412.109",
    channel: "Tray",
    product: "Produto A · Reservatório 20 L",
    qty: 40,
    client: "Hidráulica Serra Azul Ltda.",
    cnpj: "08.331.440/0001-19",
    phone: "47 98812-4401",
    billingAddress: "Rua XV de Novembro, 890 · Centro · Blumenau/SC · 89010-000 (SEDE)",
    deliveryAddress: "Rod. BR-470, km 42 · Galpão 3 · Gaspar/SC · 89110-971 (ENTREGA)",
    carrier: "Jamef",
    tracking: "JM-9044182",
    stage: "Trânsito",
    slaHours: 48,
    delayHours: 11,
    rules: ["Horário 8h–17h", "Docas com rampa", "Não deixar na portaria", "Conferir NF-e 412.109"],
    note: "Sede em Blumenau e descarga em Gaspar. Sem a etiqueta certa, a Jamef tenta entregar no CNPJ da sede.",
    token: "tr-2201-gaspar",
    volumes: 2,
    audit: [
      { t: "11:38", action: "Pedido recebido da Tray", origin: "Tray", actor: "webhook mock" },
      { t: "11:38", action: "Integrado ao SINK ERP", origin: "SINK", actor: "serviço FI" },
      { t: "11:39", action: "NF-e 412.109 autorizada", origin: "SINK", actor: "faturamento" },
      { t: "11:41", action: "Etiqueta e QR gerados", origin: "FI", actor: "expedição" },
      { t: "12:10", action: "Coletado pela Jamef", origin: "transportadora", actor: "Jamef" },
      { t: "14:02", action: "SLA de trânsito +11 h", origin: "regra SLA", actor: "motor de alertas" },
    ],
  },
  {
    id: "RT-2198",
    saleId: "VD-8841",
    nfe: "412.107",
    channel: "Tray",
    product: "Produto A · Reservatório 20 L",
    qty: 80,
    client: "Construtora Vale Norte",
    cnpj: "14.902.118/0001-60",
    phone: "47 99901-2288",
    billingAddress: "Av. Getúlio Vargas, 210 · Joinville/SC · 89201-000 (SEDE)",
    deliveryAddress: "Obra Loteamento Araucárias · Rua das Acácias, s/n · Araquari/SC · 89245-000",
    carrier: "Correios PAC",
    tracking: "BR329881045SC",
    stage: "Separação",
    slaHours: 24,
    delayHours: 0,
    rules: ["Entrega em obra", "Agendar com mestre de obras", "Veículo até 3/4"],
    note: "Pedido Tray já sincronizado no SINK. NF-e emitida. Falta etiqueta de descarga na obra.",
    token: "tr-2198-araquari",
    volumes: 4,
    audit: [
      { t: "11:14", action: "Pedido recebido da Tray", origin: "Tray", actor: "webhook mock" },
      { t: "11:15", action: "Integrado ao SINK ERP", origin: "SINK", actor: "serviço FI" },
      { t: "11:22", action: "Separação iniciada", origin: "WMS", actor: "expedição" },
    ],
  },
  {
    id: "RT-2194",
    saleId: "VD-8839",
    nfe: "412.098",
    channel: "ERP",
    product: "Produto B · Conexão 50 mm",
    qty: 400,
    client: "Sanitários do Oeste S.A.",
    cnpj: "05.772.901/0001-33",
    phone: "45 3222-1090",
    billingAddress: "Av. República Argentina, 4500 · Cascavel/PR · 85806-000 (SEDE)",
    deliveryAddress: "CD Cascavel II · Rua Industrial, 1200 · Cascavel/PR · 85816-280",
    carrier: "Tegma",
    tracking: "TG-551209",
    stage: "Coleta",
    slaHours: 36,
    delayHours: 5,
    rules: ["Palete padronizado", "Não empilhar acima de 1,6 m", "Janela 13h–16h"],
    note: "Coleta atrasou 5 h. WhatsApp interno já avisou expedição e comercial.",
    token: "tr-2194-cascavel",
    volumes: 8,
    audit: [
      { t: "09:18", action: "Pedido criado no SINK", origin: "SINK", actor: "comercial" },
      { t: "09:40", action: "NF-e 412.098 autorizada", origin: "SINK", actor: "faturamento" },
      { t: "13:05", action: "Coleta Tegma atrasada", origin: "regra SLA", actor: "motor de alertas" },
    ],
  },
  {
    id: "RT-2188",
    saleId: "VD-8817",
    nfe: "412.066",
    channel: "ERP",
    product: "Produto E · Flange nylon 80 mm",
    qty: 40,
    client: "Metalúrgica Itajaí",
    cnpj: "31.440.218/0001-07",
    phone: "47 3344-8800",
    billingAddress: "Rua Blumenau, 55 · Itajaí/SC · 88301-000 (SEDE)",
    deliveryAddress: "Rua Blumenau, 55 · Itajaí/SC · 88301-000 (SEDE)",
    carrier: "Jadlog",
    tracking: "JD-7710021",
    stage: "Trânsito",
    slaHours: 72,
    delayHours: 26,
    rules: ["Recebedor com RG", "Não deixar com vizinho"],
    note: "Atraso de 26 h. Cliente já cobrou. IA sugere WhatsApp com nova janela e etiqueta reimpressa.",
    token: "tr-2188-itajai",
    volumes: 1,
    audit: [
      { t: "20/09 09:40", action: "Pedido no SINK", origin: "SINK", actor: "comercial" },
      { t: "20/09 11:00", action: "NF-e 412.066", origin: "SINK", actor: "faturamento" },
      { t: "21/09 08:10", action: "Saiu com Jadlog", origin: "transportadora", actor: "Jadlog" },
      { t: "22/09 09:40", action: "Atraso 26 h · alerta crítico", origin: "regra SLA", actor: "motor de alertas" },
    ],
  },
  {
    id: "RT-2181",
    saleId: "VD-8824",
    nfe: "412.051",
    channel: "Marketplace",
    product: "Produto C · Tampa técnica HDPE",
    qty: 500,
    client: "Distribuidora Litoral Plásticos",
    cnpj: "22.118.003/0001-91",
    phone: "48 99120-3344",
    billingAddress: "Av. Beira Mar, 100 · Florianópolis/SC · 88015-000 (SEDE)",
    deliveryAddress: "Rua Joe Collaço, 890 · Campinas · São José/SC · 88101-270",
    carrier: "Total Express",
    tracking: "TE-440912",
    stage: "Entrega",
    slaHours: 48,
    delayHours: 0,
    rules: ["Condomínio industrial", "Catraca com NF-e"],
    note: "Entregue no endereço de São José, não na sede de Floripa. Etiqueta evitou a devolução.",
    token: "tr-2181-saojose",
    volumes: 6,
    audit: [
      { t: "20/09 17:21", action: "Pedido marketplace", origin: "Mercado Livre", actor: "webhook mock" },
      { t: "20/09 18:00", action: "NF-e 412.051", origin: "SINK", actor: "faturamento" },
      { t: "21/09 16:40", action: "Entregue em São José", origin: "Total Express", actor: "motorista" },
    ],
  },
];

export const deliveryRulesCatalog = [
  { id: "sede", title: "Sede ≠ entrega", detail: "Sempre imprimir os dois endereços. A NF-e vai no CNPJ da sede; a caixa vai no local de descarga." },
  { id: "janela", title: "Janela horária", detail: "Obras e CDs recusam fora de 8h–17h. Atraso vira WhatsApp automático para o cliente e para a expedição." },
  { id: "doca", title: "Doca / rampa", detail: "Reservatório 20 L e tubo 75 mm exigem rampa. Sem regra, a transportadora tenta portaria." },
  { id: "nfe", title: "Conferência da NF-e", detail: "O número da NF-e na etiqueta é o mesmo do SINK ERP. Evita recusa no CD." },
];

export const payments: Payment[] = [
  { id: "BOL-4412", saleId: "VD-8839", nfe: "412.098", client: "Sanitários do Oeste S.A.", type: "Boleto", value: 9800, due: "23/09", days: 1, status: "A vencer", audience: "cliente", whatsapp: true },
  { id: "BOL-4408", saleId: "VD-8838", nfe: "412.091", client: "Hidroforte Representações", type: "Boleto", value: 2292, due: "22/09", days: 0, status: "Vence hoje", audience: "cliente", whatsapp: true },
  { id: "FAT-2207", saleId: "VD-8817", nfe: "412.066", client: "Metalúrgica Itajaí", type: "Fatura", value: 1528, due: "18/09", days: -4, status: "Vencido", audience: "cliente", whatsapp: true },
  { id: "FAT-2201", saleId: "VD-8808", nfe: "412.044", client: "Tubos Sul Ltda.", type: "Fatura", value: 5060, due: "25/09", days: 3, status: "A vencer", audience: "interno", whatsapp: false },
  { id: "BOL-4399", saleId: "VD-8828", nfe: "412.080", client: "Mercado — conta ML", type: "Boleto", value: 8575, due: "24/09", days: 2, status: "A vencer", audience: "interno", whatsapp: false },
  { id: "FAT-2194", saleId: "VD-8796", nfe: "411.988", client: "Atlas — provisão ICMS", type: "Fatura", value: 8540.5, due: "22/09", days: 0, status: "Vence hoje", audience: "interno", whatsapp: false },
  { id: "FAT-2188", saleId: "VD-8772", nfe: "411.902", client: "Plásticos Norte", type: "Fatura", value: 2101, due: "20/09", days: -2, status: "Vencido", audience: "cliente", whatsapp: true },
  { id: "BOL-4301", saleId: "VD-8760", nfe: "411.770", client: "Hidrovale Indústria", type: "Boleto", value: 6400, due: "10/09", days: -12, status: "Vencido", audience: "cliente", whatsapp: true },
  { id: "FAT-2011", saleId: "VD-8502", nfe: "410.112", client: "Tecno Tubos Ltda.", type: "Fatura", value: 12800, due: "12/08", days: -41, status: "Vencido", audience: "cliente", whatsapp: true },
  { id: "FAT-2210", saleId: "VD-8832", nfe: "412.120", client: "Loja Atlas Shopify", type: "Fatura", value: 10788, due: "15/09", days: -7, status: "Pago", audience: "interno", whatsapp: false },
  { id: "BOL-4280", saleId: "VD-8701", nfe: "411.540", client: "Pedido cancelado ML", type: "Boleto", value: 890, due: "08/09", days: -14, status: "Cancelado", audience: "interno", whatsapp: false },
];

export const whatsappQueue = [
  {
    id: "wa-1",
    to: "Sanitários do Oeste",
    phone: "45 99910-2201",
    kind: "Cobrança",
    text: "Olá, financeiro da Sanitários do Oeste. O boleto da NF-e 412.098 (R$ 9.800) vence amanhã, 23/09. Segue linha digitável. Qualquer dúvida, fale com a Atlas Polímeros.",
  },
  {
    id: "wa-2",
    to: "Hidráulica Serra Azul",
    phone: "47 98812-4401",
    kind: "Rastreio",
    text: "Seu pedido Tray VD-8843 · NF-e 412.109 saiu com a Jamef (JM-9044182). Entrega no Galpão 3 em Gaspar — não na sede de Blumenau. Há 11 h de atraso no SLA; nova janela: amanhã 8h–12h.",
  },
  {
    id: "wa-3",
    to: "Expedição Atlas",
    phone: "interno",
    kind: "Alerta interno",
    text: "RT-2194 · coleta Tegma atrasou 5 h. NF-e 412.098. Cliente Cascavel com janela 13h–16h. Reagendar antes de perder a doca.",
  },
];

export const syncEvents = [
  { t: "11:38", from: "Tray", to: "Fábrica Integrada", text: "Pedido VD-8843 · 40 un Produto A · entrega em Gaspar" },
  { t: "11:38", from: "Fábrica Integrada", to: "SINK ERP", text: "Cria pedido + reserva de estoque + dispara NF-e" },
  { t: "11:39", from: "SINK ERP", to: "Fábrica Integrada", text: "NF-e 412.109 autorizada · boleto BOL-4419 gerado" },
  { t: "11:40", from: "Fábrica Integrada", to: "WhatsApp", text: "Cliente avisado: pedido confirmado · endereço de descarga ≠ sede" },
  { t: "11:41", from: "Fábrica Integrada", to: "Rastreio", text: "Etiqueta gerada: NF-e · cliente · Jamef · Gaspar" },
];
