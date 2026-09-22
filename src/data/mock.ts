export const company = {
  name: "FL Indústria e Comércio de Produtos Descartáveis LTDA",
  short: "FLIND",
  plant: "Unidade Tijuca · RJ",
  plantCode: "PLT-RIO-01",
  cnpj: "08.945.574/0003-06",
  shift: "Comercial · 09:00–18:00",
  manager: "Carla Souza",
  role: "Coordenação de Operações",
  email: "contato@flind.com.br",
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
  channel: "E-commerce" | "ERP" | "Licitação" | "Representante";
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
    sku: "INS-GEL-01",
    name: "Gel absorvente Toalet",
    type: "insumo",
    unit: "kg",
    stock: 12400,
    minStock: 8000,
    avgDaily: 1850,
    unitCost: 8.4,
    supplier: "Química Hospitalar RJ",
  },
  {
    id: "pig-preto",
    sku: "INS-PE-09",
    name: "Filme PE para saco Toalet",
    type: "insumo",
    unit: "kg",
    stock: 180,
    minStock: 250,
    avgDaily: 42,
    unitCost: 18.9,
    supplier: "Plásticos Tijuca",
  },
  {
    id: "adt-uv",
    sku: "INS-CX-03",
    name: "Caixa e rótulo ANVISA",
    type: "insumo",
    unit: "un",
    stock: 420,
    minStock: 300,
    avgDaily: 28,
    unitCost: 2.4,
    supplier: "Embalagens Carioca",
  },
  {
    id: "nyl-pa6",
    sku: "INS-SUP-02",
    name: "Suporte plástico Toalet",
    type: "insumo",
    unit: "un",
    stock: 2100,
    minStock: 1500,
    avgDaily: 160,
    unitCost: 6.7,
    supplier: "Injeção Nova Iguaçu",
  },
  {
    id: "mb-azul",
    sku: "INS-TNT-14",
    name: "TNT para avental e enxoval",
    type: "insumo",
    unit: "kg",
    stock: 95,
    minStock: 80,
    avgDaily: 11,
    unitCost: 24.2,
    supplier: "Medix / Descarpack",
  },
];

export const products: Product[] = [
  {
    id: "atl-a",
    sku: "FLN-TOA-10",
    alias: "Toalet 10",
    name: "Kit 10 Toalet Descartável + suporte",
    family: "Toalet Descartável",
    unit: "kit",
    price: 104.85,
    unitCost: 61.4,
    stock: 540,
    minStock: 800,
    avgDaily: 90,
    line: "Linha Toalet",
    demandTrend: 18,
    wastePct: 3.1,
    bom: [
      { materialId: "res-hdpe", qty: 0.18 },
      { materialId: "pig-preto", qty: 0.04 },
      { materialId: "nyl-pa6", qty: 1 },
    ],
  },
  {
    id: "atl-b",
    sku: "FLN-TOA-24",
    alias: "Toalet 24",
    name: "Toalet Descartável · caixa com 24",
    family: "Toalet Descartável",
    unit: "cx",
    price: 214.8,
    unitCost: 128.0,
    stock: 2100,
    minStock: 1500,
    avgDaily: 280,
    line: "Linha Kit",
    demandTrend: 6,
    wastePct: 8.4,
    bom: [
      { materialId: "res-hdpe", qty: 0.42 },
      { materialId: "pig-preto", qty: 0.09 },
    ],
  },
  {
    id: "atl-c",
    sku: "FLN-MSK-50",
    alias: "Máscara",
    name: "Máscara tripla descartável Medix",
    family: "EPIs",
    unit: "cx",
    price: 7.75,
    unitCost: 4.1,
    stock: 4200,
    minStock: 2000,
    avgDaily: 310,
    line: "Linha EPI",
    demandTrend: 22,
    wastePct: 2.2,
    bom: [{ materialId: "mb-azul", qty: 0.02 }],
  },
  {
    id: "atl-d",
    sku: "FLN-AVE-ML",
    alias: "Avental",
    name: "Avental de procedimento especial ML",
    family: "EPIs",
    unit: "un",
    price: 19.98,
    unitCost: 11.2,
    stock: 1800,
    minStock: 900,
    avgDaily: 95,
    line: "Linha EPI",
    demandTrend: 4,
    wastePct: 3.8,
    bom: [{ materialId: "mb-azul", qty: 0.08 }],
  },
  {
    id: "atl-e",
    sku: "FLN-LUV-G",
    alias: "Luva",
    name: "Luva látex G · procedimento não cirúrgico",
    family: "EPIs",
    unit: "cx",
    price: 20.99,
    unitCost: 12.4,
    stock: 320,
    minStock: 400,
    avgDaily: 45,
    line: "Linha EPI",
    demandTrend: -3,
    wastePct: 4.1,
    bom: [{ materialId: "mb-azul", qty: 0.03 }],
  },
];

export const sales: Sale[] = [
  { id: "VD-8843", date: "2026-09-22", time: "11:38", productId: "atl-a", qty: 40, channel: "E-commerce", origin: "Tray", value: 3596, status: "Em separação" },
  { id: "VD-8841", date: "2026-09-22", time: "11:14", productId: "atl-a", qty: 80, channel: "E-commerce", origin: "Tray", value: 7192, status: "Novo" },
  { id: "VD-8840", date: "2026-09-22", time: "10:41", productId: "atl-c", qty: 240, channel: "Licitação", origin: "Comprasnet", value: 3072, status: "Em separação" },
  { id: "VD-8839", date: "2026-09-22", time: "09:18", productId: "atl-b", qty: 400, channel: "ERP", origin: "SINK ERP", value: 9800, status: "Faturado" },
  { id: "VD-8838", date: "2026-09-22", time: "08:02", productId: "atl-e", qty: 60, channel: "Representante", origin: "Portal B2B", value: 2292, status: "Faturado" },
  { id: "VD-8832", date: "2026-09-21", time: "16:47", productId: "atl-a", qty: 120, channel: "E-commerce", origin: "Tray", value: 10788, status: "Entregue" },
  { id: "VD-8831", date: "2026-09-21", time: "15:09", productId: "atl-d", qty: 90, channel: "ERP", origin: "SINK ERP", value: 4140, status: "Em separação" },
  { id: "VD-8828", date: "2026-09-21", time: "11:33", productId: "atl-b", qty: 350, channel: "Licitação", origin: "Comprasnet", value: 8575, status: "Faturado" },
  { id: "VD-8824", date: "2026-09-20", time: "17:21", productId: "atl-c", qty: 500, channel: "ERP", origin: "SINK ERP", value: 6400, status: "Entregue" },
  { id: "VD-8821", date: "2026-09-20", time: "13:55", productId: "atl-a", qty: 75, channel: "E-commerce", origin: "Tray", value: 6742.5, status: "Entregue" },
  { id: "VD-8817", date: "2026-09-20", time: "09:40", productId: "atl-e", qty: 40, channel: "ERP", origin: "SINK ERP", value: 1528, status: "Atrasado" },
  { id: "VD-8812", date: "2026-09-19", time: "18:12", productId: "atl-b", qty: 280, channel: "E-commerce", origin: "Tray", value: 6860, status: "Entregue" },
  { id: "VD-8808", date: "2026-09-19", time: "14:06", productId: "atl-d", qty: 110, channel: "Representante", origin: "Portal B2B", value: 5060, status: "Faturado" },
  { id: "VD-8803", date: "2026-09-19", time: "10:28", productId: "atl-c", qty: 180, channel: "Licitação", origin: "Comprasnet", value: 2304, status: "Entregue" },
  { id: "VD-8796", date: "2026-09-18", time: "16:50", productId: "atl-a", qty: 95, channel: "ERP", origin: "SINK ERP", value: 8540.5, status: "Entregue" },
  { id: "VD-8791", date: "2026-09-18", time: "11:15", productId: "atl-b", qty: 220, channel: "E-commerce", origin: "Tray", value: 5390, status: "Entregue" },
  { id: "VD-8784", date: "2026-09-17", time: "15:44", productId: "atl-d", qty: 70, channel: "ERP", origin: "SINK ERP", value: 3220, status: "Entregue" },
  { id: "VD-8779", date: "2026-09-17", time: "09:03", productId: "atl-c", qty: 260, channel: "E-commerce", origin: "Tray", value: 3328, status: "Entregue" },
  { id: "VD-8772", date: "2026-09-16", time: "13:37", productId: "atl-e", qty: 55, channel: "Licitação", origin: "Comprasnet", value: 2101, status: "Entregue" },
];

export const productionOrders: ProductionOrder[] = [
  { id: "OP-2412", productId: "atl-b", qty: 3200, line: "Linha Kit", status: "Em execução", start: "22/09 06:10", due: "22/09 21:00", cost: 56960, efficiency: 81, wastePct: 8.4, oee: 68 },
  { id: "OP-2411", productId: "atl-a", qty: 600, line: "Linha Toalet", status: "Fila", start: "22/09 09:00", due: "23/09 18:00", cost: 36840, efficiency: 0, wastePct: 0, oee: 0 },
  { id: "OP-2410", productId: "atl-c", qty: 4000, line: "Linha EPI", status: "Concluída", start: "21/09 14:20", due: "22/09 05:40", cost: 16400, efficiency: 94, wastePct: 2.2, oee: 86 },
  { id: "OP-2408", productId: "atl-d", qty: 900, line: "Linha EPI", status: "Em execução", start: "22/09 08:00", due: "22/09 19:30", cost: 10080, efficiency: 88, wastePct: 3.8, oee: 79 },
  { id: "OP-2406", productId: "atl-e", qty: 500, line: "Linha EPI", status: "Setup", start: "22/09 16:00", due: "23/09 12:00", cost: 6200, efficiency: 0, wastePct: 0, oee: 0 },
  { id: "OP-2404", productId: "atl-b", qty: 2800, line: "Linha Kit", status: "Atraso", start: "21/09 07:00", due: "21/09 22:00", cost: 49840, efficiency: 74, wastePct: 9.1, oee: 61 },
  { id: "OP-2401", productId: "atl-a", qty: 800, line: "Linha Toalet", status: "Concluída", start: "20/09 06:00", due: "20/09 18:30", cost: 49120, efficiency: 91, wastePct: 3.1, oee: 84 },
  { id: "OP-2398", productId: "atl-c", qty: 3500, line: "Linha EPI", status: "Concluída", start: "19/09 09:10", due: "19/09 23:00", cost: 14350, efficiency: 96, wastePct: 1.9, oee: 88 },
];

export const alerts: Alert[] = [
  { id: "al-1", time: "11:38", tone: "info", title: "Tray sincronizou pedido VD-8843 no SINK", detail: "40 kits Toalet + suporte. NF-e 412.109 autorizada. Entrega no CME do Hospital São Vicente — sede do cliente é Botafogo.", source: "Tray → SINK ERP" },
  { id: "al-1b", time: "11:14", tone: "critico", title: "Estoque do Toalet 10 abaixo do mínimo", detail: "Venda Tray VD-8841 reduziu o kit 10+suporte para 540 un. Cobertura estimada: 6 dias.", source: "Estoque + Tray" },
  { id: "al-pay", time: "10:05", tone: "atencao", title: "Boleto NF-e 412.098 vence amanhã", detail: "Hospital São Vicente · R$ 9.800. WhatsApp de cobrança pronto para envio.", source: "Financeiro + WhatsApp" },
  { id: "al-track", time: "09:40", tone: "critico", title: "Rastreio RT-2188 atrasou 26 h", detail: "Luva látex · Jadlog. Clínica Copacabana. Recebimento do hospital exige lote e validade.", source: "Rastreio" },
  { id: "al-2", time: "10:52", tone: "atencao", title: "Desperdício da Linha Kit em alta", detail: "Aumento de 14% nos últimos 7 dias. Selagem da caixa 24 está gerando refugo de filme PE.", source: "Produção + Custos" },
  { id: "al-3", time: "09:18", tone: "info", title: "Pedido SINK de 400 caixas Toalet 24 faturado", detail: "SINK ERP integrou VD-8839 (licitação / hospital). Consumo de filme PE acelerado.", source: "SINK ERP" },
  { id: "al-4", time: "08:40", tone: "critico", title: "Filme PE abaixo do estoque mínimo", detail: "180 kg disponíveis · mínimo 250 kg. Bloqueia nova campanha de Toalet 10 e 24.", source: "Compras + Estoque" },
  { id: "al-5", time: "07:15", tone: "ok", title: "OP-2410 concluída com OEE 86%", detail: "4.000 caixas de máscara Medix conferidas. Margem do item permanece acima da média.", source: "Produção" },
  { id: "al-6", time: "ontem", tone: "atencao", title: "Luva látex no limite operacional", detail: "320 cx versus mínimo de 400. Lote com validade a monitorar no recebimento hospitalar.", source: "Estoque + ANVISA" },
  { id: "al-fgts", time: "08:05", tone: "critico", title: "CRF do FGTS venceu há 4 dias", detail: "Sem certidão válida a FLIND fica fora do Comprasnet. A IA pode consultar a Caixa e atualizar.", source: "Conformidade" },
  { id: "al-avcb", time: "08:06", tone: "critico", title: "AVCB dos Bombeiros vencido", detail: "Vistoria humana. A IA não renova sozinha — abriu alerta para Facilities.", source: "Conformidade" },
  { id: "al-maq", time: "07:50", tone: "atencao", title: "Solda de filme PE atrasou a preventiva", detail: "4 dias fora da janela. Combina com o refugo da Linha Kit.", source: "Manutenção" },
  { id: "al-crm", time: "08:20", tone: "atencao", title: "Hospital São Vicente no ciclo de 40 dias", detail: "Última compra há 38 dias. WhatsApp de estoque + lembrete à Renata. Sem telefone.", source: "Comercial · recompra" },
];

export const recommendations: Recommendation[] = [
  {
    id: "rec-a",
    priority: "alta",
    title: "Produzir 1.200 kits Toalet 10 + suporte",
    problem: "O kit Toalet Descartável (patente FLIND) tem cobertura de cerca de 6 dias. A venda Tray desta manhã acelerou o consumo e o saldo já está 32% abaixo do mínimo.",
    dataUsed: ["Estoque FLN-TOA-10: 540 kits", "Consumo médio: 90/dia", "Demanda +18% em 14 dias", "Pedido Tray VD-8841: 80 kits", "Insumos: gel ok · filme PE crítico"],
    recommendation: "Abrir ordem de 1.200 kits na Linha Toalet para recompor cobertura para ~13 dias e absorver o pico da loja flind.com.br.",
    impact: "Evita ruptura estimada em R$ 48,5 mil de pedidos hospitalares e protege a margem do produto patenteado.",
    action: "Criar OP de 1.200 kits na Linha Toalet",
    actionKind: "producao",
    relatedProductId: "atl-a",
    qty: 1200,
  },
  {
    id: "rec-pig",
    priority: "alta",
    title: "Comprar 500 kg de filme PE para saco Toalet",
    problem: "O filme PE está 28% abaixo do mínimo e entra no Toalet 10 e na caixa 24. Sem reposição, a ordem de 1.200 kits fica inviável.",
    dataUsed: ["Estoque filme: 180 kg", "Mínimo: 250 kg", "BOM Toalet 10: 0,04 kg/kit", "Necessidade para 1.200 kits: 48 kg", "Lead time Plásticos Tijuca: 4 dias"],
    recommendation: "Não emitir automaticamente para o menor preço. Comparar 4 fornecedores: o mais barato chega em 7 dias — depois da ruptura. A opção com melhor validade e prazo entrega em 2 dias.",
    impact: "Desbloqueia a linha Toalet e evita parada estimada em 36 horas. Melhor custo-benefício: +R$ 530 vs. o menor preço, 5 dias mais cedo.",
    action: "Comparar fornecedores e gerar SC",
    actionKind: "compra",
    relatedMaterialId: "pig-preto",
    qty: 500,
  },
  {
    id: "rec-b",
    priority: "alta",
    title: "Desperdício da Linha Kit aumentou 14%",
    problem: "A caixa Toalet 24 está com custo unitário em alta. A selagem do filme PE na Linha Kit subiu 14% de refugo em 7 dias e pressiona a margem da planta.",
    dataUsed: ["Desperdício Linha Kit: 8,4% (antes 7,4%)", "OP-2404 em atraso · OEE 61%", "Custo unitário Toalet 24 em alta", "Margem planta: 32,8% (era 36,1%)"],
    recommendation: "Não acelerar a Linha Kit antes de corrigir a selagem. Recalibrar solda do saco e reclassificar lote com falha de vedação.",
    impact: "Recuperar ~1,1 p.p. de margem no Toalet 24, equivalente a R$ 18,4 mil/mês.",
    action: "Abrir ação de qualidade na Linha Kit",
    actionKind: "qualidade",
    relatedProductId: "atl-b",
  },
  {
    id: "rec-c",
    priority: "media",
    title: "Priorizar máscara Medix: demanda e margem acima da média",
    problem: "A máscara tripla cresceu 22% em demanda (hospitais e EPIs) e opera com margem de 46,1%, bem acima da média (32,8%). A Linha EPI ainda tem janela após a campanha do Toalet.",
    dataUsed: ["Demanda máscara: +22%", "Margem: 46,1%", "Estoque: 13,5 dias", "OEE Linha EPI na OP-2410: 86%"],
    recommendation: "Após produzir o Toalet 10, programar 3.500 caixas extras de máscara para a loja Tray e pedidos de hospital.",
    impact: "Ganho potencial de R$ 20,6 mil em margem nas próximas duas semanas.",
    action: "Priorizar máscara na fila da Linha EPI",
    actionKind: "prioridade",
    relatedProductId: "atl-c",
    qty: 3500,
  },
  {
    id: "rec-e",
    priority: "media",
    title: "Estoque de luva látex pode acabar em 7 dias",
    problem: "A luva G está abaixo do mínimo (320 vs 400 cx). A cobertura é de 7 dias e há uma OP apenas em setup na Linha EPI.",
    dataUsed: ["Estoque: 320 cx", "Mínimo: 400 cx", "Consumo: 45 cx/dia", "Validade do lote em conferência"],
    recommendation: "Antecipar OP-2406 e ampliar de 500 para 700 caixas enquanto a Linha EPI termina o avental.",
    impact: "Recompõe cobertura para 15 dias sem ruptura em clínicas e SAMU.",
    action: "Ampliar OP-2406 para 700 cx",
    actionKind: "producao",
    relatedProductId: "atl-e",
    qty: 700,
  },
];

export const integrations: Integration[] = [
  { id: "tray", name: "Tray · flind.com.br", layer: "E-commerce", status: "Conectado", lastSync: "há 40 s", eventsToday: 28, description: "Loja oficial Tray da FLIND. Pedido entra, baixa estoque e dispara o SINK." },
  { id: "toalet", name: "Toalet Descartável", layer: "Marca / site", status: "Conectado", lastSync: "há 2 min", eventsToday: 19, description: "Site institucional da patente Toalet, complementar à loja FLIND." },
  { id: "comprasnet", name: "Comprasnet / SISMICAT", layer: "Licitação", status: "Conectado", lastSync: "há 6 min", eventsToday: 7, description: "Credenciada a Comprasnet e catalogação militar para forças armadas." },
  { id: "sink", name: "SINK ERP", layer: "ERP", status: "Sincronizando", lastSync: "há 20 s", eventsToday: 41, description: "Pedido, estoque, NF-e e contas a receber. A FI não substitui o SINK." },
  { id: "erp-fin", name: "SINK Financeiro", layer: "ERP / Financeiro", status: "Sincronizando", lastSync: "há 1 min", eventsToday: 112, description: "NF-e, boletos PagBank e títulos a receber." },
  { id: "whatsapp", name: "WhatsApp Business", layer: "Comunicação", status: "Conectado", lastSync: "há 1 min", eventsToday: 17, description: "85% da prospecção. Recompra, rastreio, boleto — não é fila de telefone." },
  { id: "wms", name: "WMS Tijuca", layer: "Estoque", status: "Conectado", lastSync: "há 45 s", eventsToday: 88, description: "Saldos, lote e validade na Rua Garibaldi, 85." },
  { id: "mes", name: "MES Toalet / Kit / EPI", layer: "Produção", status: "Conectado", lastSync: "há 20 s", eventsToday: 47, description: "Solda do saco, montagem do kit e conferência de EPI." },
  { id: "anvisa", name: "Lote e validade", layer: "Qualidade", status: "Atenção", lastSync: "há 12 min", eventsToday: 6, description: "Rastreio de lote para recebimento em hospital e CME." },
  { id: "compras", name: "Portal de Compras", layer: "Compras", status: "Conectado", lastSync: "há 11 min", eventsToday: 9, description: "Filme PE, gel, TNT, Medix e Descarpack." },
  { id: "pagbank", name: "PagBank", layer: "Pagamento", status: "Conectado", lastSync: "há 4 min", eventsToday: 14, description: "Meio de pagamento da loja Tray." },
  { id: "cert-ai", name: "Portais de certidão", layer: "Conformidade", status: "Atenção", lastSync: "há 8 min", eventsToday: 5, description: "IA consulta Receita, Caixa, SEFAZ e TST. AVCB e ANVISA ficam com o responsável." },
  { id: "cmms", name: "Manutenção (CMMS)", layer: "Conformidade", status: "Conectado", lastSync: "há 20 s", eventsToday: 3, description: "Preventiva por máquina: solda PE, seladora, compressor, empacotadora e empilhadeira." },
  { id: "custos", name: "Custos industriais", layer: "Custos", status: "Conectado", lastSync: "há 4 min", eventsToday: 22, description: "Custo padrão, real e desvio por ordem Toalet." },
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
  { alias: "Toalet 10", name: "Kit 10 + suporte", custo: 61.4, preco: 104.85, desperdicio: 3.1 },
  { alias: "Toalet 24", name: "Caixa com 24", custo: 128, preco: 214.8, desperdicio: 8.4 },
  { alias: "Máscara", name: "Medix tripla", custo: 4.1, preco: 7.75, desperdicio: 2.2 },
  { alias: "Avental", name: "Procedimento ML", custo: 11.2, preco: 19.98, desperdicio: 3.8 },
  { alias: "Luva", name: "Látex G", custo: 12.4, preco: 20.99, desperdicio: 4.1 },
];

export const wasteByLine = [
  { line: "Toalet", atual: 2.8, anterior: 2.6 },
  { line: "Kit", atual: 8.4, anterior: 7.4 },
  { line: "EPI", atual: 3.9, anterior: 4.1 },
];

export const channelMix = [
  { name: "Tray", value: 42 },
  { name: "ERP / B2B", value: 30 },
  { name: "Licitação", value: 19 },
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
  { n: "01", title: "Venda entra", source: "Tray / licitação" },
  { n: "02", title: "Estoque atualiza", source: "WMS" },
  { n: "03", title: "Cobertura cai", source: "Motor de saldo" },
  { n: "04", title: "Insumos checados", source: "BOM + Compras" },
  { n: "05", title: "IA cruza tudo", source: "Motor analítico" },
  { n: "06", title: "Ação ao gestor", source: "Central de IA" },
];
