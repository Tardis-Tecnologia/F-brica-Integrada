export type RfqGroup = {
  id: string;
  label: string;
  ask: string;
  suppliers: string[];
};

export const rfqGroups: RfqGroup[] = [
  {
    id: "luva",
    label: "Luva",
    ask: "Tem luva látex G no estoque? Qual preço você consegue colocar — não o de tabela. Qtd muda o valor.",
    suppliers: ["Descarpack", "Medix", "DKP"],
  },
  {
    id: "mascara",
    label: "Máscara / EPI",
    ask: "Tem máscara tripla Medix? Preço negociado para caixa 50 e para volume hospitalar.",
    suppliers: ["Medix", "Descarpack"],
  },
  {
    id: "filme",
    label: "Filme PE / Toalet",
    ask: "Tem filme PE para saco Toalet? Preço de agora — a tabela muda todo dia.",
    suppliers: ["Filme Médico SP", "Plásticos Baixada", "Plásticos Tijuca"],
  },
  {
    id: "avental",
    label: "Avental",
    ask: "Tem avental procedimento ML? Foto do item. Tem no estoque hoje e a que preço?",
    suppliers: ["Medix", "Descarpack"],
  },
];

export type LotRow = {
  productId: string;
  lot: string;
  mfg: string;
  exp: string;
  shelfYears: number;
  lifeLeftPct: number;
  hospitalMin: number;
  boxQty: number;
  reserved: number;
  marginPct: number;
};

export const lotRows: LotRow[] = [
  {
    productId: "atl-a",
    lot: "LT-2408-TOA",
    mfg: "02/08/2026",
    exp: "02/08/2027",
    shelfYears: 1,
    lifeLeftPct: 82,
    hospitalMin: 85,
    boxQty: 10,
    reserved: 120,
    marginPct: 41,
  },
  {
    productId: "atl-b",
    lot: "LT-2406-CX24",
    mfg: "18/06/2026",
    exp: "18/06/2031",
    shelfYears: 5,
    lifeLeftPct: 94,
    hospitalMin: 85,
    boxQty: 24,
    reserved: 400,
    marginPct: 40,
  },
  {
    productId: "atl-c",
    lot: "LT-2410-MSK",
    mfg: "01/10/2025",
    exp: "01/10/2028",
    shelfYears: 3,
    lifeLeftPct: 67,
    hospitalMin: 85,
    boxQty: 50,
    reserved: 240,
    marginPct: 47,
  },
  {
    productId: "atl-d",
    lot: "LT-2409-AVE",
    mfg: "12/09/2025",
    exp: "12/09/2028",
    shelfYears: 3,
    lifeLeftPct: 66,
    hospitalMin: 85,
    boxQty: 10,
    reserved: 0,
    marginPct: 44,
  },
  {
    productId: "atl-e",
    lot: "LT-2407-LUV",
    mfg: "04/07/2026",
    exp: "04/07/2029",
    shelfYears: 3,
    lifeLeftPct: 88,
    hospitalMin: 85,
    boxQty: 100,
    reserved: 60,
    marginPct: 41,
  },
];

export const orderSteps = [
  { n: "1", title: "Pedido do cliente", source: "WhatsApp · Tray · cotação" },
  { n: "2", title: "Tem no estoque?", source: "Saldo − reservado, não NF-e" },
  { n: "3", title: "Se falta, compra", source: "RFQ no WhatsApp do fornecedor" },
  { n: "4", title: "Vendeu × a pagar", source: "SINK já cotou — FI só interage" },
];

export type CatalogItem = {
  productId: string;
  segment: "Hospitalar" | "Profissional" | "Ferida";
  ncm: string;
  boxQty: number;
  weightKg: number;
  photo: string;
  tech: string;
  tray: boolean;
  trayWhy: string;
};

export const catalogItems: CatalogItem[] = [
  {
    productId: "atl-a",
    segment: "Hospitalar",
    ncm: "3926.90.90",
    boxQty: 10,
    weightKg: 2.4,
    photo: "kit + suporte, foto de uso no CME",
    tech: "filme PE + gel · validade 1 ano",
    tray: true,
    trayWhy: "kit justifica frete · ticket alto",
  },
  {
    productId: "atl-b",
    segment: "Hospitalar",
    ncm: "3926.90.90",
    boxQty: 24,
    weightKg: 5.1,
    photo: "caixa 24 lacrada",
    tech: "validade 5 anos · caixa fechada",
    tray: true,
    trayWhy: "volume hospitalar · frete cabe",
  },
  {
    productId: "atl-c",
    segment: "Hospitalar",
    ncm: "6307.90.10",
    boxQty: 50,
    weightKg: 0.4,
    photo: "caixa 50 · marca Medix",
    tech: "tripla camada · mesmo SKU Descarpack",
    tray: false,
    trayWhy: "caixa barata · frete come a margem",
  },
  {
    productId: "atl-d",
    segment: "Profissional",
    ncm: "6210.10.00",
    boxQty: 10,
    weightKg: 1.1,
    photo: "avental ML aberto",
    tech: "TNT gramatura hospitalar",
    tray: false,
    trayWhy: "só sobe na Tray em kit, não avulso",
  },
  {
    productId: "atl-e",
    segment: "Ferida",
    ncm: "4015.11.00",
    boxQty: 100,
    weightKg: 0.9,
    photo: "caixa 100 · foto da luva",
    tech: "látex G · procedimento",
    tray: false,
    trayWhy: "preço de caixa não paga o envio",
  },
];

export type ShipDeal = {
  id: string;
  client: string;
  hq: string;
  shipTo: string;
  freightPct: number;
  freightPayer: "FLIND" | "Cliente" | "CIF negociado";
  sla: string;
  hold: string;
};

export const shipDeals: ShipDeal[] = [
  {
    id: "sd-hsv",
    client: "Hospital São Vicente",
    hq: "CNPJ sede · Botafogo",
    shipTo: "CME Urca · unidade de entrega",
    freightPct: 4.2,
    freightPayer: "CIF negociado",
    sla: "Amanhã · se atrasar, vai pro fim da fila (5 dias)",
    hold: "Preço de agosto neste pedido. No próximo não seguro.",
  },
  {
    id: "sd-samu",
    client: "SAMU Rio",
    hq: "CNPJ prefeitura",
    shipTo: "Base Leblon · não a secretaria",
    freightPct: 3.1,
    freightPayer: "Cliente",
    sla: "D+1 se confirmar até 14h",
    hold: "Volume fecha o preço. Caixa avulsa sobe.",
  },
  {
    id: "sd-copa",
    client: "Clínica Copacabana",
    hq: "Mesmo CNPJ da clínica",
    shipTo: "Recepção · não consultório",
    freightPct: 6.8,
    freightPayer: "FLIND",
    sla: "Fila de 5 dias — pedido pequeno",
    hold: "Frete já come a margem da luva.",
  },
];
