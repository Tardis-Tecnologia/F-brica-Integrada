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
  channel: "Tray" | "ERP" | "Licitação";
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
    product: "Toalet 10 · kit + suporte",
    qty: 40,
    client: "Hospital São Vicente",
    cnpj: "08.331.440/0001-19",
    phone: "21 98812-4401",
    billingAddress: "Rua Voluntários da Pátria, 890 · Botafogo · Rio de Janeiro/RJ · 22270-000 (SEDE)",
    deliveryAddress: "CME · Av. Pasteur, 220 · Urca · Rio de Janeiro/RJ · 22290-240 (ENTREGA)",
    carrier: "Jamef",
    tracking: "JM-9044182",
    stage: "Trânsito",
    slaHours: 48,
    delayHours: 11,
    rules: ["Horário 8h–17h", "Recebimento no CME", "Conferir lote e validade", "Conferir NF-e 412.109"],
    note: "Sede em Botafogo e descarga no CME da Urca. Sem a etiqueta certa, a Jamef tenta entregar no CNPJ da sede.",
    token: "tr-2201-cme",
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
    product: "Toalet 10 · kit + suporte",
    qty: 80,
    client: "Construtora Litoral Carioca",
    cnpj: "14.902.118/0001-60",
    phone: "21 99901-2288",
    billingAddress: "Av. Rio Branco, 210 · Centro · Rio de Janeiro/RJ · 20040-001 (SEDE)",
    deliveryAddress: "Canteiro Linha 4 · Av. das Américas, s/n · Barra · Rio de Janeiro/RJ · 22640-100",
    carrier: "Correios PAC",
    tracking: "BR329881045RJ",
    stage: "Separação",
    slaHours: 24,
    delayHours: 0,
    rules: ["Entrega em obra", "Agendar com SESMT", "Veículo até 3/4"],
    note: "Pedido Tray já sincronizado no SINK. NF-e emitida. Falta etiqueta de descarga no canteiro.",
    token: "tr-2198-barra",
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
    product: "Toalet 24 · caixa com 24",
    qty: 400,
    client: "Hospital São Vicente",
    cnpj: "05.772.901/0001-33",
    phone: "21 3222-1090",
    billingAddress: "Rua Voluntários da Pátria, 890 · Botafogo · Rio de Janeiro/RJ · 22270-000 (SEDE)",
    deliveryAddress: "Almoxarifado · Rua Real Grandeza, 120 · Botafogo · Rio de Janeiro/RJ · 22281-034",
    carrier: "Tegma",
    tracking: "TG-551209",
    stage: "Coleta",
    slaHours: 36,
    delayHours: 5,
    rules: ["Palete padronizado", "Não empilhar acima de 1,6 m", "Janela 13h–16h"],
    note: "Coleta atrasou 5 h. WhatsApp interno já avisou expedição e comercial.",
    token: "tr-2194-botafogo",
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
    product: "Luva látex G · procedimento",
    qty: 40,
    client: "Clínica Copacabana",
    cnpj: "31.440.218/0001-07",
    phone: "21 3344-8800",
    billingAddress: "Av. Nossa Sra. de Copacabana, 55 · Rio de Janeiro/RJ · 22020-001 (SEDE)",
    deliveryAddress: "Av. Nossa Sra. de Copacabana, 55 · Rio de Janeiro/RJ · 22020-001 (SEDE)",
    carrier: "Jadlog",
    tracking: "JD-7710021",
    stage: "Trânsito",
    slaHours: 72,
    delayHours: 26,
    rules: ["Recebedor com RG", "Não deixar com vizinho"],
    note: "Atraso de 26 h. Cliente já cobrou. IA sugere WhatsApp com nova janela e etiqueta reimpressa.",
    token: "tr-2188-copa",
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
    channel: "Licitação",
    product: "Máscara tripla Medix",
    qty: 500,
    client: "SAMU Rio",
    cnpj: "22.118.003/0001-91",
    phone: "21 99120-3344",
    billingAddress: "Rua Afonso Cavalcanti, 455 · Cidade Nova · Rio de Janeiro/RJ · 20211-110 (SEDE)",
    deliveryAddress: "Base SAMU · Av. Brasil, 890 · Manguinhos · Rio de Janeiro/RJ · 21040-360",
    carrier: "Total Express",
    tracking: "TE-440912",
    stage: "Entrega",
    slaHours: 48,
    delayHours: 0,
    rules: ["Condomínio industrial", "Catraca com NF-e"],
    note: "Entregue na base de Manguinhos, não na sede da Cidade Nova. Etiqueta evitou a devolução.",
    token: "tr-2181-samu",
    volumes: 6,
    audit: [
      { t: "20/09 17:21", action: "Pedido Comprasnet", origin: "Licitação", actor: "webhook mock" },
      { t: "20/09 18:00", action: "NF-e 412.051", origin: "SINK", actor: "faturamento" },
      { t: "21/09 16:40", action: "Entregue na base SAMU", origin: "Total Express", actor: "motorista" },
    ],
  },
];

export const deliveryRulesCatalog = [
  { id: "sede", title: "Sede ≠ entrega", detail: "Sempre imprimir os dois endereços. A NF-e vai no CNPJ da sede; a caixa vai no local de descarga." },
  { id: "janela", title: "Janela horária", detail: "CME e canteiro recusam fora de 8h–17h. Atraso vira WhatsApp para o cliente e para a expedição da Tijuca." },
  { id: "cme", title: "CME / almoxarifado", detail: "Hospital e clínica recebem no CME ou farmácia, não na portaria. Sem regra, a transportadora tenta a sede." },
  { id: "lote", title: "Lote e validade", detail: "A etiqueta leva NF-e, lote e validade. Sem isso o recebimento hospitalar recusa a carga." },
];

export const payments: Payment[] = [
  { id: "BOL-4412", saleId: "VD-8839", nfe: "412.098", client: "Hospital São Vicente", type: "Boleto", value: 9800, due: "23/09", days: 1, status: "A vencer", audience: "cliente", whatsapp: true },
  { id: "BOL-4408", saleId: "VD-8838", nfe: "412.091", client: "Clínica Tijuca Saúde", type: "Boleto", value: 2292, due: "22/09", days: 0, status: "Vence hoje", audience: "cliente", whatsapp: true },
  { id: "FAT-2207", saleId: "VD-8817", nfe: "412.066", client: "Clínica Copacabana", type: "Fatura", value: 1528, due: "18/09", days: -4, status: "Vencido", audience: "cliente", whatsapp: true },
  { id: "FAT-2201", saleId: "VD-8808", nfe: "412.044", client: "Farmácia Hospitalar Sul", type: "Fatura", value: 5060, due: "25/09", days: 3, status: "A vencer", audience: "interno", whatsapp: false },
  { id: "BOL-4399", saleId: "VD-8828", nfe: "412.080", client: "Licitação Comprasnet", type: "Boleto", value: 8575, due: "24/09", days: 2, status: "A vencer", audience: "interno", whatsapp: false },
  { id: "FAT-2194", saleId: "VD-8796", nfe: "411.988", client: "FLIND — provisão ICMS", type: "Fatura", value: 8540.5, due: "22/09", days: 0, status: "Vence hoje", audience: "interno", whatsapp: false },
  { id: "FAT-2188", saleId: "VD-8772", nfe: "411.902", client: "Hotel Aeroporto Galeão", type: "Fatura", value: 2101, due: "20/09", days: -2, status: "Vencido", audience: "cliente", whatsapp: true },
  { id: "BOL-4301", saleId: "VD-8760", nfe: "411.770", client: "SAMU Rio", type: "Boleto", value: 6400, due: "10/09", days: -12, status: "Vencido", audience: "cliente", whatsapp: true },
  { id: "FAT-2011", saleId: "VD-8502", nfe: "410.112", client: "Hospital Municipal", type: "Fatura", value: 12800, due: "12/08", days: -41, status: "Vencido", audience: "cliente", whatsapp: true },
  { id: "FAT-2210", saleId: "VD-8832", nfe: "412.120", client: "Loja Tray FLIND", type: "Fatura", value: 10788, due: "15/09", days: -7, status: "Pago", audience: "interno", whatsapp: false },
  { id: "BOL-4280", saleId: "VD-8701", nfe: "411.540", client: "Pedido cancelado Tray", type: "Boleto", value: 890, due: "08/09", days: -14, status: "Cancelado", audience: "interno", whatsapp: false },
];

export const whatsappQueue = [
  {
    id: "wa-1",
    to: "Hospital São Vicente",
    phone: "21 99910-2201",
    kind: "Cobrança",
    text: "Olá, financeiro do Hospital São Vicente. O boleto da NF-e 412.098 (R$ 9.800) vence amanhã, 23/09. Segue linha digitável. Qualquer dúvida, fale com a FLIND · (21) 3264-8340.",
  },
  {
    id: "wa-2",
    to: "Hospital São Vicente",
    phone: "21 98812-4401",
    kind: "Rastreio",
    text: "Seu pedido Tray VD-8843 · NF-e 412.109 saiu com a Jamef (JM-9044182). Entrega no CME da Urca — não na sede de Botafogo. Há 11 h de atraso no SLA; nova janela: amanhã 8h–12h.",
  },
  {
    id: "wa-3",
    to: "Expedição FLIND",
    phone: "interno",
    kind: "Alerta interno",
    text: "RT-2194 · coleta Tegma atrasou 5 h. NF-e 412.098. Hospital com janela 13h–16h no almoxarifado. Reagendar antes de perder o recebimento.",
  },
];

export const syncEvents = [
  { t: "11:38", from: "Tray", to: "Fábrica Integrada", text: "Pedido VD-8843 · 40 kits Toalet · entrega no CME" },
  { t: "11:38", from: "Fábrica Integrada", to: "SINK ERP", text: "Cria pedido + reserva de estoque + dispara NF-e" },
  { t: "11:39", from: "SINK ERP", to: "Fábrica Integrada", text: "NF-e 412.109 autorizada · boleto PagBank gerado" },
  { t: "11:40", from: "Fábrica Integrada", to: "WhatsApp", text: "Cliente avisado: pedido confirmado · CME ≠ sede" },
  { t: "11:41", from: "Fábrica Integrada", to: "Rastreio", text: "Etiqueta gerada: NF-e · lote · Jamef · Urca" },
];
