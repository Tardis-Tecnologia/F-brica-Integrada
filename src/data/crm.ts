export type AbcClass = "A" | "B" | "C";
export type LeadChannel = "WhatsApp" | "E-mail" | "Tray" | "Cotação";
export type CycleFlag = "cedo" | "janela" | "atrasado";

export type Account = {
  id: string;
  name: string;
  abc: AbcClass;
  sku: string;
  product: string;
  cycleDays: number;
  lastBuyDays: number;
  lastBuy: string;
  avgTicket: number;
  channel: LeadChannel;
  owner: string;
  phone: string;
  email: string;
  stockHint: string;
  alerted: boolean;
  risk?: string;
  hq?: string;
  shipTo?: string;
  holdPrice?: string;
};

export type Lead = {
  id: string;
  name: string;
  origin: LeadChannel;
  stage: "Novo" | "Conversa" | "Proposta" | "Ganho";
  ageDays: number;
  owner: string;
  note: string;
};

export function cycleFlag(lastBuyDays: number, cycleDays: number): CycleFlag {
  const delta = lastBuyDays - cycleDays;
  if (delta >= 3) return "atrasado";
  if (delta >= -5) return "janela";
  return "cedo";
}

export function cycleLabel(f: CycleFlag) {
  if (f === "atrasado") return "Ciclo atrasado";
  if (f === "janela") return "Hora de repor";
  return "Ainda cedo";
}

export const accountsSeed: Account[] = [
  {
    id: "ac-hsv",
    name: "Hospital São Vicente",
    abc: "A",
    sku: "FLN-TOA-10",
    product: "Toalet 10 + suporte",
    cycleDays: 40,
    lastBuyDays: 38,
    lastBuy: "15/08",
    avgTicket: 4194,
    channel: "WhatsApp",
    owner: "Renata · comercial",
    phone: "21 98812-4401",
    email: "compras@saovicente.med.br",
    stockHint: "Pelo ritmo de 40 em 40 dias, o CME deve estar no fim do kit.",
    alerted: false,
    hq: "Sede Botafogo",
    shipTo: "CME Urca",
    holdPrice: "Preço de agosto neste pedido. No próximo não seguro.",
  },
  {
    id: "ac-samu",
    name: "SAMU Rio",
    abc: "A",
    sku: "FLN-MSK-50",
    product: "Máscara tripla Medix",
    cycleDays: 45,
    lastBuyDays: 52,
    lastBuy: "01/08",
    avgTicket: 3875,
    channel: "Cotação",
    owner: "Renata · comercial",
    phone: "21 99120-3344",
    email: "suprimentos@samu.rio.gov.br",
    stockHint: "Compra a cada 45 dias. Já passou 7 dias do ciclo — risco de ruptura na base.",
    alerted: false,
    hq: "CNPJ prefeitura",
    shipTo: "Base Leblon",
    holdPrice: "Volume fecha o preço. Caixa avulsa sobe.",
  },
  {
    id: "ac-copa",
    name: "Clínica Copacabana",
    abc: "B",
    sku: "FLN-LUV-G",
    product: "Luva látex G",
    cycleDays: 30,
    lastBuyDays: 26,
    lastBuy: "27/08",
    avgTicket: 840,
    channel: "WhatsApp",
    owner: "Diego · comercial",
    phone: "21 3344-8800",
    email: "compras@clinicacopa.com",
    stockHint: "Ciclo de 30 dias. Janela abre agora — WhatsApp, não telefone.",
    alerted: false,
  },
  {
    id: "ac-tij",
    name: "Clínica Tijuca Saúde",
    abc: "B",
    sku: "FLN-AVE-ML",
    product: "Avental procedimento",
    cycleDays: 35,
    lastBuyDays: 12,
    lastBuy: "10/09",
    avgTicket: 1998,
    channel: "Tray",
    owner: "Diego · comercial",
    phone: "21 3264-1100",
    email: "pedidos@tijucasaude.com",
    stockHint: "Comprou há 12 dias na loja. Ainda não é hora de cobrir.",
    alerted: false,
  },
  {
    id: "ac-hotel",
    name: "Hotel Aeroporto Galeão",
    abc: "C",
    sku: "FLN-TOA-24",
    product: "Toalet caixa 24",
    cycleDays: 60,
    lastBuyDays: 58,
    lastBuy: "26/07",
    avgTicket: 2148,
    channel: "E-mail",
    owner: "Renata · comercial",
    phone: "21 3398-2200",
    email: "compras@galeaohotel.com",
    stockHint: "Ciclo de 60 dias. E-mail + WhatsApp: recepção não atende visita.",
    alerted: false,
  },
  {
    id: "ac-obra",
    name: "Construtora Litoral Carioca",
    abc: "C",
    sku: "FLN-TOA-10",
    product: "Toalet 10 + suporte",
    cycleDays: 50,
    lastBuyDays: 61,
    lastBuy: "23/07",
    avgTicket: 8388,
    channel: "WhatsApp",
    owner: "Diego · comercial",
    phone: "21 99901-2288",
    email: "sesmt@litoralcarioca.com",
    stockHint: "Canteiro some 50 dias. Já passou o ciclo. SESMT só responde WhatsApp.",
    alerted: false,
    risk: "Atrasa muito · juros comem a margem. Vale continuar?",
  },
];

export const leadsSeed: Lead[] = [
  {
    id: "ld-1",
    name: "Hospital Federal da Lagoa",
    origin: "WhatsApp",
    stage: "Conversa",
    ageDays: 2,
    owner: "Renata",
    note: "Pediu tabela Toalet 24. Não atende ramal. Seguir no WhatsApp.",
  },
  {
    id: "ld-2",
    name: "Clínica Barra Day",
    origin: "E-mail",
    stage: "Proposta",
    ageDays: 5,
    owner: "Diego",
    note: "Cotação de máscara + luva. Follow-up só por e-mail.",
  },
  {
    id: "ld-3",
    name: "Loja Tray · pedido avulso Niterói",
    origin: "Tray",
    stage: "Novo",
    ageDays: 0,
    owner: "Fila digital",
    note: "Primeira compra na flind.com.br. Virar cadência se repetir.",
  },
  {
    id: "ld-4",
    name: "Prefeitura — Comprasnet",
    origin: "Cotação",
    stage: "Proposta",
    ageDays: 9,
    owner: "Renata",
    note: "Edital de EPI. Sem visita. Documentos por e-mail.",
  },
];

export const prospectMix = [
  { name: "WhatsApp", value: 62 },
  { name: "E-mail", value: 23 },
  { name: "Tray", value: 10 },
  { name: "Cotação", value: 5 },
];
