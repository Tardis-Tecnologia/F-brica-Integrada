export const company = {
  name: "Atlas Polímeros Ltda.",
  short: "Atlas Polímeros",
  plant: "Unidade Joinville · SC",
  plantCode: "PLT-JOI-01",
  cnpj: "18.442.901/0001-62",
  shift: "2º turno · 14:00–22:00",
  manager: "Marina Costa",
  role: "Diretora de Operações",
  email: "marina.costa@atlaspolimeros.com",
};

export type StatusTone = "critico" | "atencao" | "ok" | "info";

export type Material = {
  id: string;
  sku: string;
  name: string;
  type: "insumo";
  unit: string;
  stock: number;
  minStock: number;
  avgDaily: number;
  unitCost: number;
  supplier: string;
};

export type Product = {
  id: string;
  sku: string;
  alias: string;
  name: string;
  family: string;
  unit: string;
  price: number;
  unitCost: number;
  stock: number;
  minStock: number;
  avgDaily: number;
  line: string;
  demandTrend: number;
  wastePct: number;
  bom: { materialId: string; qty: number }[];
};

export type Sale = {
  id: string;
  date: string;
  time: string;
  productId: string;
  qty: number;
  channel: "E-commerce" | "ERP" | "Marketplace" | "Representante";
  origin: string;
  value: number;
  status: "Faturado" | "Em separação" | "Novo" | "Entregue" | "Atrasado";
};

export type ProductionOrder = {
  id: string;
  productId: string;
  qty: number;
  line: string;
  status: "Em execução" | "Fila" | "Concluída" | "Atraso" | "Setup";
  start: string;
  due: string;
  cost: number;
  efficiency: number;
  wastePct: number;
  oee: number;
};

export type Alert = {
  id: string;
  time: string;
  tone: StatusTone;
  title: string;
  detail: string;
  source: string;
};

export type Recommendation = {
  id: string;
  priority: "alta" | "media" | "baixa";
  title: string;
  problem: string;
  dataUsed: string[];
  recommendation: string;
  impact: string;
  action: string;
  actionKind: "producao" | "compra" | "qualidade" | "prioridade";
  relatedProductId?: string;
  relatedMaterialId?: string;
  qty?: number;
  applied?: boolean;
};

export type Integration = {
  id: string;
  name: string;
  layer: string;
  status: "Conectado" | "Sincronizando" | "Atenção";
  lastSync: string;
  eventsToday: number;
  description: string;
};

export const materials: Material[] = [
  {
    id: "res-hdpe",
    sku: "INS-HDPE-01",
    name: "Resina HDPE natural",
    type: "insumo",
    unit: "kg",
    stock: 12400,
    minStock: 8000,
    avgDaily: 1850,
    unitCost: 8.4,
    supplier: "Braskem",
  },
  {
    id: "pig-preto",
    sku: "INS-PIG-09",
    name: "Pigmento preto industrial",
    type: "insumo",
    unit: "kg",
    stock: 180,
    minStock: 250,
    avgDaily: 42,
    unitCost: 18.9,
    supplier: "Lanxess",
  },
  {
    id: "adt-uv",
    sku: "INS-UV-03",
    name: "Aditivo UV estabilizante",
    type: "insumo",
    unit: "kg",
    stock: 420,
    minStock: 300,
    avgDaily: 28,
    unitCost: 32.5,
    supplier: "BASF",
  },
  {
    id: "nyl-pa6",
    sku: "INS-PA6-02",
    name: "Nylon PA6 técnico",
    type: "insumo",
    unit: "kg",
    stock: 2100,
    minStock: 1500,
    avgDaily: 160,
    unitCost: 21.7,
    supplier: "Radici",
  },
  {
    id: "mb-azul",
    sku: "INS-MB-14",
    name: "Masterbatch azul técnico",
    type: "insumo",
    unit: "kg",
    stock: 95,
    minStock: 80,
    avgDaily: 11,
    unitCost: 24.2,
    supplier: "Cromex",
  },
];

export const products: Product[] = [
  {
    id: "atl-a",
    sku: "ATL-R20",
    alias: "Produto A",
    name: "Reservatório industrial 20 L",
    family: "Contenção",
    unit: "un",
    price: 89.9,
    unitCost: 61.4,
    stock: 540,
    minStock: 800,
    avgDaily: 90,
    line: "Linha 1",
    demandTrend: 18,
    wastePct: 3.1,
    bom: [
      { materialId: "res-hdpe", qty: 1.8 },
      { materialId: "pig-preto", qty: 0.04 },
      { materialId: "adt-uv", qty: 0.02 },
    ],
  },
  {
    id: "atl-b",
    sku: "ATL-C50",
    alias: "Produto B",
    name: "Conexão hidráulica 50 mm",
    family: "Conexões",
    unit: "un",
    price: 24.5,
    unitCost: 17.8,
    stock: 2100,
    minStock: 1500,
    avgDaily: 280,
    line: "Linha 2",
    demandTrend: 6,
    wastePct: 8.4,
    bom: [
      { materialId: "res-hdpe", qty: 0.32 },
      { materialId: "pig-preto", qty: 0.012 },
    ],
  },
  {
    id: "atl-c",
    sku: "ATL-T12",
    alias: "Produto C",
    name: "Tampa técnica HDPE",
    family: "Tampas",
    unit: "un",
    price: 12.8,
    unitCost: 6.9,
    stock: 4200,
    minStock: 2000,
    avgDaily: 310,
    line: "Linha 1",
    demandTrend: 22,
    wastePct: 2.2,
    bom: [
      { materialId: "res-hdpe", qty: 0.18 },
      { materialId: "mb-azul", qty: 0.008 },
    ],
  },
  {
    id: "atl-d",
    sku: "ATL-T75",
    alias: "Produto D",
    name: "Tubo estrutural 75 mm",
    family: "Tubos",
    unit: "un",
    price: 46.0,
    unitCost: 31.2,
    stock: 1800,
    minStock: 900,
    avgDaily: 95,
    line: "Linha 3",
    demandTrend: 4,
    wastePct: 3.8,
    bom: [
      { materialId: "res-hdpe", qty: 0.95 },
      { materialId: "adt-uv", qty: 0.015 },
    ],
  },
  {
    id: "atl-e",
    sku: "ATL-F80",
    alias: "Produto E",
    name: "Flange nylon 80 mm",
    family: "Flanges",
    unit: "un",
    price: 38.2,
    unitCost: 26.4,
    stock: 320,
    minStock: 400,
    avgDaily: 45,
    line: "Linha 3",
    demandTrend: -3,
    wastePct: 4.1,
    bom: [
      { materialId: "nyl-pa6", qty: 0.42 },
      { materialId: "pig-preto", qty: 0.01 },
    ],
  },
];

export const sales: Sale[] = [
  { id: "VD-8843", date: "2026-09-22", time: "11:38", productId: "atl-a", qty: 40, channel: "E-commerce", origin: "Tray", value: 3596, status: "Em separação" },
  { id: "VD-8841", date: "2026-09-22", time: "11:14", productId: "atl-a", qty: 80, channel: "E-commerce", origin: "Tray", value: 7192, status: "Novo" },
  { id: "VD-8840", date: "2026-09-22", time: "10:41", productId: "atl-c", qty: 240, channel: "Marketplace", origin: "Mercado Livre", value: 3072, status: "Em separação" },
  { id: "VD-8839", date: "2026-09-22", time: "09:18", productId: "atl-b", qty: 400, channel: "ERP", origin: "SINK ERP", value: 9800, status: "Faturado" },
  { id: "VD-8838", date: "2026-09-22", time: "08:02", productId: "atl-e", qty: 60, channel: "Representante", origin: "Portal B2B", value: 2292, status: "Faturado" },
  { id: "VD-8832", date: "2026-09-21", time: "16:47", productId: "atl-a", qty: 120, channel: "E-commerce", origin: "Shopify", value: 10788, status: "Entregue" },
  { id: "VD-8831", date: "2026-09-21", time: "15:09", productId: "atl-d", qty: 90, channel: "ERP", origin: "SINK ERP", value: 4140, status: "Em separação" },
  { id: "VD-8828", date: "2026-09-21", time: "11:33", productId: "atl-b", qty: 350, channel: "Marketplace", origin: "Mercado Livre", value: 8575, status: "Faturado" },
  { id: "VD-8824", date: "2026-09-20", time: "17:21", productId: "atl-c", qty: 500, channel: "ERP", origin: "SINK ERP", value: 6400, status: "Entregue" },
  { id: "VD-8821", date: "2026-09-20", time: "13:55", productId: "atl-a", qty: 75, channel: "E-commerce", origin: "Shopify", value: 6742.5, status: "Entregue" },
  { id: "VD-8817", date: "2026-09-20", time: "09:40", productId: "atl-e", qty: 40, channel: "ERP", origin: "SINK ERP", value: 1528, status: "Atrasado" },
  { id: "VD-8812", date: "2026-09-19", time: "18:12", productId: "atl-b", qty: 280, channel: "E-commerce", origin: "Shopify", value: 6860, status: "Entregue" },
  { id: "VD-8808", date: "2026-09-19", time: "14:06", productId: "atl-d", qty: 110, channel: "Representante", origin: "Portal B2B", value: 5060, status: "Faturado" },
  { id: "VD-8803", date: "2026-09-19", time: "10:28", productId: "atl-c", qty: 180, channel: "Marketplace", origin: "Mercado Livre", value: 2304, status: "Entregue" },
  { id: "VD-8796", date: "2026-09-18", time: "16:50", productId: "atl-a", qty: 95, channel: "ERP", origin: "SINK ERP", value: 8540.5, status: "Entregue" },
  { id: "VD-8791", date: "2026-09-18", time: "11:15", productId: "atl-b", qty: 220, channel: "E-commerce", origin: "Shopify", value: 5390, status: "Entregue" },
  { id: "VD-8784", date: "2026-09-17", time: "15:44", productId: "atl-d", qty: 70, channel: "ERP", origin: "SINK ERP", value: 3220, status: "Entregue" },
  { id: "VD-8779", date: "2026-09-17", time: "09:03", productId: "atl-c", qty: 260, channel: "E-commerce", origin: "Shopify", value: 3328, status: "Entregue" },
  { id: "VD-8772", date: "2026-09-16", time: "13:37", productId: "atl-e", qty: 55, channel: "Marketplace", origin: "Mercado Livre", value: 2101, status: "Entregue" },
];

export const productionOrders: ProductionOrder[] = [
  { id: "OP-2412", productId: "atl-b", qty: 3200, line: "Linha 2", status: "Em execução", start: "22/09 06:10", due: "22/09 21:00", cost: 56960, efficiency: 81, wastePct: 8.4, oee: 68 },
  { id: "OP-2411", productId: "atl-a", qty: 600, line: "Linha 1", status: "Fila", start: "22/09 22:00", due: "23/09 08:00", cost: 36840, efficiency: 0, wastePct: 0, oee: 0 },
  { id: "OP-2410", productId: "atl-c", qty: 4000, line: "Linha 1", status: "Concluída", start: "21/09 14:20", due: "22/09 05:40", cost: 27600, efficiency: 94, wastePct: 2.2, oee: 86 },
  { id: "OP-2408", productId: "atl-d", qty: 900, line: "Linha 3", status: "Em execução", start: "22/09 08:00", due: "22/09 19:30", cost: 28080, efficiency: 88, wastePct: 3.8, oee: 79 },
  { id: "OP-2406", productId: "atl-e", qty: 500, line: "Linha 3", status: "Setup", start: "22/09 20:00", due: "23/09 04:00", cost: 13200, efficiency: 0, wastePct: 0, oee: 0 },
  { id: "OP-2404", productId: "atl-b", qty: 2800, line: "Linha 2", status: "Atraso", start: "21/09 07:00", due: "21/09 22:00", cost: 49840, efficiency: 74, wastePct: 9.1, oee: 61 },
  { id: "OP-2401", productId: "atl-a", qty: 800, line: "Linha 1", status: "Concluída", start: "20/09 06:00", due: "20/09 18:30", cost: 49120, efficiency: 91, wastePct: 3.1, oee: 84 },
  { id: "OP-2398", productId: "atl-c", qty: 3500, line: "Linha 1", status: "Concluída", start: "19/09 09:10", due: "19/09 23:00", cost: 24150, efficiency: 96, wastePct: 1.9, oee: 88 },
];

export const alerts: Alert[] = [
  { id: "al-1", time: "11:38", tone: "info", title: "Tray sincronizou pedido VD-8843 no SINK", detail: "40 un do Produto A. NF-e 412.109 autorizada. Entrega em Gaspar — sede do cliente é Blumenau.", source: "Tray → SINK ERP" },
  { id: "al-1b", time: "11:14", tone: "critico", title: "Estoque do Produto A abaixo do mínimo", detail: "Venda Tray VD-8841 reduziu o Reservatório 20 L para 540 un. Cobertura estimada: 6 dias.", source: "Estoque + Tray" },
  { id: "al-pay", time: "10:05", tone: "atencao", title: "Boleto NF-e 412.098 vence amanhã", detail: "Sanitários do Oeste · R$ 9.800. WhatsApp de cobrança pronto para envio.", source: "Financeiro + WhatsApp" },
  { id: "al-track", time: "09:40", tone: "critico", title: "Rastreio RT-2188 atrasou 26 h", detail: "Flange nylon · Jadlog. Cliente Metalúrgica Itajaí. IA sugere novo prazo via WhatsApp.", source: "Rastreio" },
  { id: "al-2", time: "10:52", tone: "atencao", title: "Desperdício da Linha 2 em alta", detail: "Aumento de 14% nos últimos 7 dias. Custo unitário da Conexão 50 mm subiu para R$ 17,80.", source: "Produção + Custos" },
  { id: "al-3", time: "09:18", tone: "info", title: "Pedido SINK de 400 conexões faturado", detail: "SINK ERP integrou VD-8839. Consumo de pigmento preto acelerado.", source: "SINK ERP" },
  { id: "al-4", time: "08:40", tone: "critico", title: "Pigmento preto abaixo do estoque mínimo", detail: "180 kg disponíveis · mínimo 250 kg. Bloqueia nova campanha do Produto A e B.", source: "Compras + Estoque" },
  { id: "al-5", time: "07:15", tone: "ok", title: "OP-2410 concluída com OEE 86%", detail: "4.000 tampas técnicas finalizadas. Margem do Produto C permanece acima da média.", source: "Produção" },
  { id: "al-6", time: "ontem", tone: "atencao", title: "Flange nylon no limite operacional", detail: "Produto E com 320 un versus mínimo de 400. Demanda estável, mas cobertura de 7 dias.", source: "Estoque" },
];

export const recommendations: Recommendation[] = [
  {
    id: "rec-a",
    priority: "alta",
    title: "Produzir 1.200 unidades do Produto A",
    problem: "O Reservatório industrial 20 L possui estoque para aproximadamente 6 dias. A venda e-commerce desta manhã acelerou o consumo e o saldo já está 32% abaixo do mínimo.",
    dataUsed: ["Estoque ATL-R20: 540 un", "Consumo médio: 90 un/dia", "Demanda +18% em 14 dias", "Pedido Shopify VD-8841: 80 un", "Insumos: HDPE ok · Pigmento crítico"],
    recommendation: "Abrir ordem de 1.200 unidades na Linha 1 para recompor cobertura para ~13 dias e absorver o pico de e-commerce.",
    impact: "Evita ruptura estimada em R$ 48,5 mil de pedidos e protege margem de 31,7% do Produto A.",
    action: "Criar OP de 1.200 un na Linha 1",
    actionKind: "producao",
    relatedProductId: "atl-a",
    qty: 1200,
  },
  {
    id: "rec-pig",
    priority: "alta",
    title: "Comprar 500 kg do Insumo Pigmento preto",
    problem: "O pigmento preto está 28% abaixo do mínimo e é comum ao Produto A, B e E. Sem reposição, a ordem recomendada do Reservatório 20 L fica inviável.",
    dataUsed: ["Estoque pigmento: 180 kg", "Mínimo: 250 kg", "BOM Produto A: 0,04 kg/un", "Necessidade para 1.200 un A: 48 kg", "Lead time Lanxess: 4 dias"],
    recommendation: "Não emitir automaticamente para o menor preço. Comparar 4 fornecedores: a Colorquímica é mais barata, mas chega em 7 dias — depois da ruptura. A BASF Colorants entrega em 2 dias com qualidade 4,8/5.",
    impact: "Desbloqueia produção de A e B e evita parada de pigmento estimada em 36 horas de linha. Melhor custo-benefício: BASF (+R$ 530 vs. o menor preço, 5 dias mais cedo).",
    action: "Comparar fornecedores e gerar SC",
    actionKind: "compra",
    relatedMaterialId: "pig-preto",
    qty: 500,
  },
  {
    id: "rec-b",
    priority: "alta",
    title: "Desperdício da Linha 2 aumentou 14%",
    problem: "A Conexão hidráulica 50 mm (Produto B) está com custo unitário em alta. O desperdício da Linha 2 subiu 14% em 7 dias e já pressiona a margem consolidada da planta.",
    dataUsed: ["Desperdício Linha 2: 8,4% (antes 7,4%)", "OP-2404 em atraso · OEE 61%", "Custo unitário B: R$ 17,80 (+R$ 1,10)", "Margem planta: 32,8% (era 36,1%)"],
    recommendation: "Não acelerar a Linha 2 antes de corrigir setup térmico. Recalibrar molde da conexão 50 mm e reprocessar refugo classificado.",
    impact: "Recuperar ~1,1 p.p. de margem no Produto B, equivalente a R$ 18,4 mil/mês.",
    action: "Abrir ação de qualidade na Linha 2",
    actionKind: "qualidade",
    relatedProductId: "atl-b",
  },
  {
    id: "rec-c",
    priority: "media",
    title: "Priorizar Produto C: demanda e margem acima da média",
    problem: "A Tampa técnica HDPE cresceu 22% em demanda e opera com margem de 46,1%, bem acima da média da planta (32,8%). A Linha 1 ainda tem janela após a campanha do Produto A.",
    dataUsed: ["Demanda C: +22%", "Margem C: 46,1%", "Estoque C: 13,5 dias", "OEE Linha 1 na OP-2410: 86%"],
    recommendation: "Após produzir o Produto A, programar 3.500 tampas extras para o marketplace, enquanto a Linha 1 está estável.",
    impact: "Ganho potencial de R$ 20,6 mil em margem nas próximas duas semanas.",
    action: "Priorizar Produto C na fila da Linha 1",
    actionKind: "prioridade",
    relatedProductId: "atl-c",
    qty: 3500,
  },
  {
    id: "rec-e",
    priority: "media",
    title: "Estoque do Produto E pode acabar em 7 dias",
    problem: "O Flange nylon 80 mm está abaixo do mínimo (320 vs 400). A cobertura é de 7 dias e há uma OP apenas em setup na Linha 3.",
    dataUsed: ["Estoque E: 320 un", "Mínimo: 400 un", "Consumo: 45 un/dia", "Nylon PA6 disponível: 2.100 kg"],
    recommendation: "Antecipar OP-2406 e ampliar de 500 para 700 unidades enquanto a Linha 3 termina o tubo 75 mm.",
    impact: "Recompõe cobertura para 15 dias sem compra extra de nylon.",
    action: "Ampliar OP-2406 para 700 un",
    actionKind: "producao",
    relatedProductId: "atl-e",
    qty: 700,
  },
];

export const integrations: Integration[] = [
  { id: "tray", name: "Tray", layer: "E-commerce", status: "Conectado", lastSync: "há 40 s", eventsToday: 28, description: "Pedidos da loja Tray entram na Fábrica Integrada e disparam o SINK ERP. Tudo simulado neste protótipo." },
  { id: "shopify", name: "Shopify", layer: "E-commerce", status: "Conectado", lastSync: "há 2 min", eventsToday: 64, description: "Pedidos online, rupturas e mix de canais digitais." },
  { id: "meli", name: "Mercado Livre", layer: "E-commerce", status: "Conectado", lastSync: "há 6 min", eventsToday: 31, description: "Marketplace B2C e antecipação de demanda." },
  { id: "sink", name: "SINK ERP", layer: "ERP", status: "Sincronizando", lastSync: "há 20 s", eventsToday: 41, description: "Camada mock: pedido, estoque, NF-e, faturamento e contas a receber. A FI não substitui o SINK." },
  { id: "erp-fin", name: "SINK Financeiro", layer: "ERP / Financeiro", status: "Sincronizando", lastSync: "há 1 min", eventsToday: 112, description: "NF-e, boletos e títulos a receber — dados de demonstração." },
  { id: "whatsapp", name: "WhatsApp Business", layer: "Comunicação", status: "Conectado", lastSync: "há 1 min", eventsToday: 17, description: "Cliente e time interno: rastreio, atraso, boleto a vencer e entrega." },
  { id: "wms", name: "WMS Atlas", layer: "Estoque", status: "Conectado", lastSync: "há 45 s", eventsToday: 88, description: "Saldos de produto acabado e endereçamento." },
  { id: "mes", name: "MES Linhas 1–3", layer: "Produção", status: "Conectado", lastSync: "há 20 s", eventsToday: 47, description: "OEE, ordens, paradas e desperdício de processo." },
  { id: "compras", name: "Portal de Compras", layer: "Compras", status: "Conectado", lastSync: "há 11 min", eventsToday: 9, description: "Pedidos a fornecedores, lead time e histórico que alimentam a Compras Inteligentes." },
  { id: "b2b", name: "Marketplace B2B", layer: "Compras", status: "Sincronizando", lastSync: "simulado", eventsToday: 4, description: "Catálogo externo e cotações de marketplace — ativo como base simulada neste protótipo." },
  { id: "api-forn", name: "APIs de fornecedores", layer: "Compras", status: "Atenção", lastSync: "versão definitiva", eventsToday: 0, description: "BASF, Dow e similares via API. Aqui as cotações já entram na comparação." },
  { id: "custos", name: "Custos industriais", layer: "Custos", status: "Conectado", lastSync: "há 4 min", eventsToday: 22, description: "Custo padrão, real e desvio por ordem." },
  { id: "qms", name: "QMS Qualidade", layer: "Desperdícios", status: "Atenção", lastSync: "há 41 min", eventsToday: 5, description: "Refugo, retrabalho e não conformidades da Linha 2." },
];

export const revenueSeries = [
  { day: "09/09", receita: 71200, custo: 49200, desperdicio: 2100 },
  { day: "10/09", receita: 75400, custo: 50800, desperdicio: 1980 },
  { day: "11/09", receita: 69800, custo: 48100, desperdicio: 2240 },
  { day: "12/09", receita: 82100, custo: 53600, desperdicio: 2410 },
  { day: "13/09", receita: 64300, custo: 45200, desperdicio: 1890 },
  { day: "15/09", receita: 88700, custo: 57900, desperdicio: 2680 },
  { day: "16/09", receita: 91200, custo: 60100, desperdicio: 3120 },
  { day: "17/09", receita: 86800, custo: 58400, desperdicio: 3340 },
  { day: "18/09", receita: 94500, custo: 62200, desperdicio: 3510 },
  { day: "19/09", receita: 98100, custo: 64800, desperdicio: 3720 },
  { day: "20/09", receita: 102400, custo: 67100, desperdicio: 4010 },
  { day: "21/09", receita: 108700, custo: 70200, desperdicio: 4280 },
  { day: "22/09", receita: 86400, custo: 58100, desperdicio: 3960 },
];

export const costByProduct = [
  { alias: "A", name: "Reservatório 20 L", custo: 61.4, preco: 89.9, desperdicio: 3.1 },
  { alias: "B", name: "Conexão 50 mm", custo: 17.8, preco: 24.5, desperdicio: 8.4 },
  { alias: "C", name: "Tampa HDPE", custo: 6.9, preco: 12.8, desperdicio: 2.2 },
  { alias: "D", name: "Tubo 75 mm", custo: 31.2, preco: 46.0, desperdicio: 3.8 },
  { alias: "E", name: "Flange nylon", custo: 26.4, preco: 38.2, desperdicio: 4.1 },
];

export const wasteByLine = [
  { line: "Linha 1", atual: 2.8, anterior: 2.6 },
  { line: "Linha 2", atual: 8.4, anterior: 7.4 },
  { line: "Linha 3", atual: 3.9, anterior: 4.1 },
];

export const channelMix = [
  { name: "E-commerce", value: 34 },
  { name: "ERP", value: 41 },
  { name: "Marketplace", value: 16 },
  { name: "Representante", value: 9 },
];

export const kpisSeed = {
  revenue: 1847320,
  orders: 2184,
  produced: 18420,
  stockValue: 892400,
  costs: 1241180,
  margin: 32.8,
  waste: 4.8,
  oee: 74.2,
};

export const flowSteps = [
  { n: "01", title: "Venda entra", source: "E-commerce / ERP" },
  { n: "02", title: "Estoque atualiza", source: "WMS" },
  { n: "03", title: "Cobertura cai", source: "Motor de saldo" },
  { n: "04", title: "Insumos checados", source: "BOM + Compras" },
  { n: "05", title: "Produção necessária", source: "MES" },
  { n: "06", title: "Custos e perdas", source: "Custos industriais" },
  { n: "07", title: "IA cruza tudo", source: "Motor analítico" },
  { n: "08", title: "Ação ao gestor", source: "Central de IA" },
];
