export type QuoteOrigin =
  | "Cadastro interno"
  | "Catálogo externo"
  | "Marketplace B2B"
  | "API do fornecedor"
  | "Cotação recebida";

export type Quote = {
  id: string;
  supplierName: string;
  city: string;
  materialId: string;
  origin: QuoteOrigin;
  unitPrice: number;
  leadDays: number;
  quality: number;
  available: number;
  delayRate: number;
  returnRate: number;
  payment: string;
  freight: number;
  orders12m: number;
};

export type NeedSeed = {
  id: string;
  materialId: string;
  baseQty: number;
  priority: "alta" | "media";
  drivers: string[];
  insight: string;
};

export const needSeeds: NeedSeed[] = [
  {
    id: "need-pig",
    materialId: "pig-preto",
    baseQty: 500,
    priority: "alta",
    drivers: [
      "Venda Tray do Toalet 10 acelerou a reposição",
      "OP recomendada de 1.200 kits pede 48 kg de filme PE",
      "Linha Kit consome o mesmo filme na caixa 24",
      "Saldo 180 kg vs. mínimo 250 kg · 4,3 dias de cobertura",
    ],
    insight:
      "Com base nas vendas da loja FLIND e nas ordens atuais, serão necessários 500 kg de filme PE nos próximos 7 dias. Sem essa compra, a campanha do Toalet e a Linha Kit param.",
  },
  {
    id: "need-hdpe",
    materialId: "res-hdpe",
    baseQty: 3200,
    priority: "media",
    drivers: [
      "Cobertura de gel absorvente em 6,7 dias",
      "Campanha de 1.200 kits Toalet pede gel extra",
      "OP-2412 e OP-2408 já consomem gel hoje",
    ],
    insight:
      "O gel ainda está acima do mínimo, mas a combinação de consumo diário e a ordem do Toalet 10 estoura a cobertura da semana. Recomendamos 3.200 kg de antecipação.",
  },
  {
    id: "need-mb",
    materialId: "mb-azul",
    baseQty: 120,
    priority: "media",
    drivers: [
      "Máscara Medix com demanda +22% e melhor margem",
      "Estoque TNT 95 kg · mínimo 80 kg · 8,6 dias",
      "Priorizar máscara e avental na Linha EPI consome TNT",
    ],
    insight:
      "O TNT não está crítico hoje, mas a priorização de máscara e avental queima o buffer. 120 kg cobrem duas semanas da fila extra.",
  },
];

export const quotes: Quote[] = [
  {
    id: "q-pig-color",
    supplierName: "Plásticos Baixada",
    city: "Duque de Caxias · RJ",
    materialId: "pig-preto",
    origin: "Marketplace B2B",
    unitPrice: 17.4,
    leadDays: 7,
    quality: 4.1,
    available: 800,
    delayRate: 14,
    returnRate: 3.8,
    payment: "14 dias",
    freight: 380,
    orders12m: 4,
  },
  {
    id: "q-pig-basf",
    supplierName: "Filme Médico SP",
    city: "Guarulhos · SP",
    materialId: "pig-preto",
    origin: "API do fornecedor",
    unitPrice: 18.2,
    leadDays: 2,
    quality: 4.8,
    available: 3500,
    delayRate: 2,
    returnRate: 0.4,
    payment: "28 dias",
    freight: 510,
    orders12m: 11,
  },
  {
    id: "q-pig-lanxess",
    supplierName: "Plásticos Tijuca",
    city: "Rio de Janeiro · RJ",
    materialId: "pig-preto",
    origin: "Cadastro interno",
    unitPrice: 18.9,
    leadDays: 4,
    quality: 4.6,
    available: 2000,
    delayRate: 6,
    returnRate: 1.2,
    payment: "30 dias",
    freight: 420,
    orders12m: 18,
  },
  {
    id: "q-pig-cromex",
    supplierName: "PoliSaúde Express",
    city: "São Paulo · SP",
    materialId: "pig-preto",
    origin: "Catálogo externo",
    unitPrice: 19.1,
    leadDays: 1,
    quality: 4.5,
    available: 600,
    delayRate: 3,
    returnRate: 0.9,
    payment: "À vista · 2% desc.",
    freight: 640,
    orders12m: 7,
  },
  {
    id: "q-hdpe-unipar",
    supplierName: "Gel Norte",
    city: "Duque de Caxias · RJ",
    materialId: "res-hdpe",
    origin: "Marketplace B2B",
    unitPrice: 8.15,
    leadDays: 8,
    quality: 4.3,
    available: 12000,
    delayRate: 9,
    returnRate: 1.8,
    payment: "21 dias",
    freight: 890,
    orders12m: 3,
  },
  {
    id: "q-hdpe-braskem",
    supplierName: "Química Hospitalar RJ",
    city: "Rio de Janeiro · RJ",
    materialId: "res-hdpe",
    origin: "Cadastro interno",
    unitPrice: 8.4,
    leadDays: 5,
    quality: 4.7,
    available: 40000,
    delayRate: 4,
    returnRate: 0.6,
    payment: "30 dias",
    freight: 720,
    orders12m: 22,
  },
  {
    id: "q-hdpe-dow",
    supplierName: "Absorvente Plus",
    city: "Camaçari · BA",
    materialId: "res-hdpe",
    origin: "API do fornecedor",
    unitPrice: 8.55,
    leadDays: 3,
    quality: 4.8,
    available: 18000,
    delayRate: 2.5,
    returnRate: 0.3,
    payment: "28 dias",
    freight: 980,
    orders12m: 6,
  },
  {
    id: "q-mb-poly",
    supplierName: "TNT Leste",
    city: "Nova Iguaçu · RJ",
    materialId: "mb-azul",
    origin: "Cotação recebida",
    unitPrice: 22.8,
    leadDays: 6,
    quality: 4.2,
    available: 400,
    delayRate: 11,
    returnRate: 2.4,
    payment: "14 dias",
    freight: 210,
    orders12m: 2,
  },
  {
    id: "q-mb-cromex",
    supplierName: "Medix",
    city: "São Paulo · SP",
    materialId: "mb-azul",
    origin: "Cadastro interno",
    unitPrice: 24.2,
    leadDays: 4,
    quality: 4.5,
    available: 500,
    delayRate: 5,
    returnRate: 1.1,
    payment: "30 dias",
    freight: 180,
    orders12m: 9,
  },
  {
    id: "q-mb-clariant",
    supplierName: "Descarpack",
    city: "São Paulo · SP",
    materialId: "mb-azul",
    origin: "Catálogo externo",
    unitPrice: 23.9,
    leadDays: 2,
    quality: 4.7,
    available: 900,
    delayRate: 2,
    returnRate: 0.5,
    payment: "28 dias",
    freight: 240,
    orders12m: 5,
  },
];

export const purchaseHistory = [
  { id: "SC-1018", date: "12/09", material: "Gel absorvente Toalet", supplier: "Química Hospitalar RJ", qty: 8000, total: 67920, onTime: true },
  { id: "SC-1024", date: "15/09", material: "Caixa e rótulo ANVISA", supplier: "Embalagens Carioca", qty: 2000, total: 4800, onTime: true },
  { id: "SC-1029", date: "18/09", material: "Filme PE para saco Toalet", supplier: "Plásticos Tijuca", qty: 220, total: 4578, onTime: false },
  { id: "SC-1033", date: "20/09", material: "Suporte plástico Toalet", supplier: "Injeção Nova Iguaçu", qty: 900, total: 6030, onTime: true },
];

export const futureChannels = [
  { id: "cad", title: "Fornecedores cadastrados", now: true, detail: "Plásticos Tijuca, Química Hospitalar, Medix e Descarpack." },
  { id: "cat", title: "Catálogos externos", now: false, detail: "Medix e Descarpack simulados como consulta a catálogo." },
  { id: "b2b", title: "Marketplaces B2B", now: false, detail: "Cotações de filme e gel no canal B2B." },
  { id: "api", title: "APIs de fornecedores", now: false, detail: "Filme Médico e Absorvente Plus como cotação via API." },
  { id: "rfq", title: "Solicitar cotações", now: false, detail: "Na versão definitiva, dispara RFQ e aguarda propostas." },
  { id: "cmp", title: "Comparar propostas", now: true, detail: "Preço, prazo, qualidade, atraso, frete e total já cruzados." },
  { id: "hist", title: "Histórico de compras", now: true, detail: "SCs recentes da FLIND alimentam o índice de atraso." },
];

export const buyFlow = [
  { n: "01", title: "Venda / produção", source: "Tray · MES" },
  { n: "02", title: "Estoque cai", source: "WMS Tijuca" },
  { n: "03", title: "Ruptura à vista", source: "Motor de saldo" },
  { n: "04", title: "BOM do insumo", source: "Toalet / EPI" },
  { n: "05", title: "Qtd. calculada", source: "7 dias + campanha" },
  { n: "06", title: "Fornecedores", source: "Cadastro · B2B · API" },
  { n: "07", title: "Comparação", source: "Preço ≠ melhor" },
  { n: "08", title: "Recomendação", source: "Custo-benefício" },
];
