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
      "Venda Shopify do Produto A acelerou a reposição",
      "OP recomendada de 1.200 un A pede 48 kg no BOM",
      "Linha 2 consome pigmento na Conexão 50 mm",
      "Saldo 180 kg vs. mínimo 250 kg · 4,3 dias de cobertura",
    ],
    insight:
      "Com base nas vendas e nas ordens de produção atuais, serão necessários 500 kg adicionais de Pigmento preto industrial nos próximos 7 dias. Sem essa compra, a campanha do Produto A e a Linha 2 param.",
  },
  {
    id: "need-hdpe",
    materialId: "res-hdpe",
    baseQty: 3200,
    priority: "media",
    drivers: [
      "Cobertura de resina em 6,7 dias",
      "Campanha de 1.200 Reservatórios 20 L pede 2.160 kg",
      "OP-2412 e OP-2408 já consomem HDPE hoje",
    ],
    insight:
      "A resina HDPE ainda está acima do mínimo, mas a combinação de consumo diário e a ordem do Produto A estoura a cobertura da semana. Recomendamos 3.200 kg de antecipação.",
  },
  {
    id: "need-mb",
    materialId: "mb-azul",
    baseQty: 120,
    priority: "media",
    drivers: [
      "Produto C com demanda +22% e melhor margem da planta",
      "Estoque 95 kg · mínimo 80 kg · 8,6 dias",
      "Priorizar C na Linha 1 consome masterbatch azul",
    ],
    insight:
      "O Masterbatch azul técnico não está crítico hoje, mas a priorização do Produto C queima o buffer. 120 kg cobrem duas semanas da fila extra.",
  },
];

export const quotes: Quote[] = [
  {
    id: "q-pig-color",
    supplierName: "Colorquímica",
    city: "Caxias do Sul · RS",
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
    supplierName: "BASF Colorants",
    city: "Guaratinguetá · SP",
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
    supplierName: "Lanxess",
    city: "Porto Feliz · SP",
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
    supplierName: "Cromex",
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
    supplierName: "Unipar",
    city: "Santo André · SP",
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
    supplierName: "Braskem",
    city: "Triunfo · RS",
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
    supplierName: "Dow",
    city: "Bahia · BA",
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
    supplierName: "Avient",
    city: "Campinas · SP",
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
    supplierName: "Cromex",
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
    supplierName: "Clariant",
    city: "Suzano · SP",
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
  { id: "SC-1018", date: "12/09", material: "Resina HDPE natural", supplier: "Braskem", qty: 8000, total: 67920, onTime: true },
  { id: "SC-1024", date: "15/09", material: "Aditivo UV estabilizante", supplier: "BASF", qty: 200, total: 6700, onTime: true },
  { id: "SC-1029", date: "18/09", material: "Pigmento preto industrial", supplier: "Lanxess", qty: 220, total: 4578, onTime: false },
  { id: "SC-1033", date: "20/09", material: "Nylon PA6 técnico", supplier: "Radici", qty: 900, total: 19980, onTime: true },
];

export const futureChannels = [
  { id: "cad", title: "Fornecedores cadastrados", now: true, detail: "Lanxess, Braskem, Cromex e Radici já entram na comparação." },
  { id: "cat", title: "Catálogos externos", now: false, detail: "Cromex e Clariant simulados como consulta a catálogo." },
  { id: "b2b", title: "Marketplaces B2B", now: false, detail: "Colorquímica e Unipar representam o canal de marketplace." },
  { id: "api", title: "APIs de fornecedores", now: false, detail: "BASF e Dow entram como cotação via API." },
  { id: "rfq", title: "Solicitar cotações", now: false, detail: "Na versão definitiva, dispara RFQ e aguarda propostas." },
  { id: "cmp", title: "Comparar propostas", now: true, detail: "Preço, prazo, qualidade, atraso, frete e total já cruzados." },
  { id: "hist", title: "Histórico de compras", now: true, detail: "SCs recentes da Atlas Polímeros alimentam o índice de atraso." },
];

export const buyFlow = [
  { n: "01", title: "Venda / produção", source: "Shopify · MES" },
  { n: "02", title: "Estoque cai", source: "WMS" },
  { n: "03", title: "Ruptura à vista", source: "Motor de saldo" },
  { n: "04", title: "BOM do insumo", source: "Produto A / B / E" },
  { n: "05", title: "Qtd. calculada", source: "7 dias + campanha" },
  { n: "06", title: "Fornecedores", source: "Cadastro · B2B · API" },
  { n: "07", title: "Comparação", source: "Preço ≠ melhor" },
  { n: "08", title: "Recomendação", source: "Custo-benefício" },
];
