import type { Material, Product } from "../data/mock";
import { coverLabel, money, pct, qty } from "./format";

export const chips = [
  "Como está minha produção?",
  "Quais produtos estão com estoque crítico?",
  "Devo comprar algum insumo?",
  "Qual o melhor fornecedor de pigmento?",
  "Onde está o pedido da Tray?",
  "Quais boletos vencem esta semana?",
  "Onde estou perdendo dinheiro?",
  "Por que minha margem caiu?",
  "Preciso produzir alguma coisa esta semana?",
];

export function answerQuestion(
  raw: string,
  products: Product[],
  materials: Material[],
) {
  const q = raw.toLowerCase();
  const a = products.find((p) => p.id === "atl-a")!;
  const b = products.find((p) => p.id === "atl-b")!;
  const c = products.find((p) => p.id === "atl-c")!;
  const e = products.find((p) => p.id === "atl-e")!;
  const pig = materials.find((m) => m.id === "pig-preto")!;
  const coverA = coverLabel(a.stock, a.avgDaily);
  const coverE = coverLabel(e.stock, e.avgDaily);

  if (q.includes("estoque") || q.includes("crít") || q.includes("crit")) {
    return {
      title: "Dois produtos e um insumo estão críticos agora.",
      body: `${a.alias} · ${a.name}: ${qty(a.stock)} un / mínimo ${qty(a.minStock)} · ${coverA} de cobertura. Última venda Shopify de 80 un já entrou no saldo.\n\n${e.alias} · ${e.name}: ${qty(e.stock)} un / mínimo ${qty(e.minStock)} · ${coverE}.\n\nInsumo: ${pig.name} com ${qty(pig.stock)} kg (mínimo ${qty(pig.minStock)} kg). Sem comprar 500 kg, a ordem de 1.200 do Produto A fica comprometida — o BOM pede 0,04 kg por unidade.\n\n${b.alias} e ${c.alias} estão cobertos (cerca de ${coverLabel(b.stock, b.avgDaily)} e ${coverLabel(c.stock, c.avgDaily)}).`,
    };
  }

  if (
    q.includes("compr") ||
    q.includes("fornecedor") ||
    q.includes("pigmento") ||
    q.includes("insumo")
  ) {
    return {
      title: "Sim. O gargalo de compra é o pigmento preto — e o menor preço não serve.",
      body: `${pig.name}: ${qty(pig.stock)} kg / mínimo ${qty(pig.minStock)} kg · ${coverLabel(pig.stock, pig.avgDaily)} de cobertura.\n\nA campanha de 1.200 un do ${a.alias} pede 48 kg no BOM, e a Linha 2 já consome o mesmo insumo. A IA calculou 500 kg para os próximos 7 dias.\n\nFornecedores comparados:\n• Colorquímica · R$ 17,40/kg · 7 dias · mais barata, mas chega depois da ruptura.\n• BASF Colorants · R$ 18,20/kg · 2 dias · qualidade 4,8/5 · melhor custo-benefício.\n• Lanxess (cadastro) · R$ 18,90/kg · 4 dias · no limite da cobertura.\n• Cromex · 1 dia · a mais rápida, mais cara.\n\nRecomendação: BASF. Custa cerca de R$ 530 a mais que a opção mais barata, mas entrega dois dias antes da ruptura e tem 2% de atraso histórico. Abra Compras Inteligentes para gerar a SC.`,
    };
  }

  if (
    q.includes("tray") ||
    q.includes("rastre") ||
    q.includes("etiqueta") ||
    q.includes("entrega") ||
    q.includes("nfe") ||
    q.includes("nf-e") ||
    q.includes("pedido da")
  ) {
    return {
      title: "O pedido Tray VD-8843 já está no ERP e atrasou 11 h no trânsito.",
      body: "Tray enviou 40 un do Produto A (Hidráulica Serra Azul). O ERP Sync autorizou a NF-e 412.109 e gerou a etiqueta.\n\nSede do cliente: Blumenau. Entrega: Galpão 3 em Gaspar. Sem essa distinção a Jamef entrega no CNPJ errado.\n\nLinha do tempo: Pedido → NF-e → Separação → Etiqueta → Coleta → Trânsito (agora, +11 h) → Entrega.\n\nRegras na etiqueta: 8h–17h, doca com rampa, não deixar na portaria, conferir a NF-e.\n\nA IA já montou o WhatsApp para o cliente com o rastreador JM-9044182. Abra Rastreio para gerar a etiqueta ou avisar no WhatsApp.",
    };
  }

  if (
    q.includes("boleto") ||
    q.includes("fatura") ||
    q.includes("cobran") ||
    q.includes("pagament") ||
    q.includes("vence") ||
    q.includes("whatsapp")
  ) {
    return {
      title: "Há cobrança ao cliente e alerta interno no mesmo radar.",
      body: "Cliente: boleto da NF-e 412.098 (Sanitários do Oeste, R$ 9.800) vence amanhã. Boleto 4408 vence hoje. Fatura da Metalúrgica Itajaí está vencida há 4 dias.\n\nInterno: fatura Atlas/ICMS vence hoje e o título Tubos Sul vence em 25/09 — o financeiro precisa ver, o cliente não.\n\nO WhatsApp Business já tem 3 mensagens prontas: cobrança, rastreio atrasado e alerta para a expedição.\n\nAbra Cobranças para disparar. A TI e a IA só montam e registram; quem autoriza o envio é o gestor.",
    };
  }

  if (q.includes("perdendo") || q.includes("desperd") || q.includes("dinheiro")) {
    return {
      title: "A perda visível está na Linha 2, não no volume de vendas.",
      body: `O desperdício da Linha 2 subiu 14% em 7 dias e levou o custo do ${b.alias} a ${money(b.unitCost, true)}. Cada ponto percentual extra de refugo nessa linha custa cerca de R$ 16 mil/mês.\n\nA margem da planta caiu de 36,1% para 32,8% no período — a maior parte do desvio vem desse processo, não de preço.\n\nO ${c.alias} é o oposto: margem de ${pct(((c.price - c.unitCost) / c.price) * 100)} e demanda +22%. É onde o dinheiro está sendo bem feito.\n\nAção: qualidade na Linha 2 primeiro; depois produzir A e priorizar C.`,
    };
  }

  if (q.includes("margem") || q.includes("caiu") || q.includes("custo")) {
    return {
      title: "A margem caiu 3,3 p.p. porque o custo do Produto B subiu.",
      body: `Margem atual: 32,8% · anterior: 36,1%.\n\nO ${b.alias} teve +R$ 1,10 no custo unitário com o desperdício da Linha 2 em 8,4%. Como ele tem volume alto (${qty(b.avgDaily)} un/dia), o efeito no consolidado é imediato.\n\nFaturamento segue firme (R$ 1,85 mi no mês) — o problema não é demanda. É eficiência.\n\nRecuperar 1,1 p.p. só no Produto B devolve cerca de R$ 18,4 mil/mês. Enquanto isso, o ${c.alias} permanece com margem ${pct(((c.price - c.unitCost) / c.price) * 100)}, acima da média, e deveria ganhar fila na Linha 1.`,
    };
  }

  if ((q.includes("produzir") || q.includes("produção") || q.includes("producao")) && (q.includes("semana") || q.includes("precis"))) {
    return {
      title: "Sim. Há três movimentos de produção nesta semana.",
      body: `O ${a.alias} (${a.name}) está com ${qty(a.stock)} un — cobertura de ${coverA}, abaixo do mínimo de ${qty(a.minStock)}. Recomendo produzir 1.200 unidades na Linha 1.\n\nO ${e.alias} também pede antecipação: ${qty(e.stock)} un, ${coverE} de cobertura. Ampliar a OP-2406 para 700 un resolve.\n\nAntes de acelerar o ${b.alias} na Linha 2, corrija o desperdício (+14% em 7 dias). Produzir mais agora só empurraria custo unitário para cima.`,
    };
  }

  if (q.includes("produção") || q.includes("producao") || q.includes("minha produ")) {
    return {
      title: "Produção está operacional, com um ponto vermelho na Linha 2.",
      body: `Linha 1: OP-2410 concluída (OEE 86%) e OP-2411 de 600 ${a.alias} na fila — insuficiente frente à cobertura de ${coverA}.\n\nLinha 2: OP-2412 em execução (3.200 conexões) com eficiência 81% e desperdício 8,4%. A OP-2404 atrasou (OEE 61%).\n\nLinha 3: tubo 75 mm em execução (OEE 79%) e flange nylon em setup.\n\nOEE planta: 74,2%. O gargalo não é capacidade total — é qualidade da Linha 2 + falta de pigmento para uma campanha maior do Produto A.`,
    };
  }

  if (q.includes("venda") || q.includes("pedido") || q.includes("e-commerce") || q.includes("ecommerce")) {
    return {
      title: "As vendas estão saudáveis e multi-canal — o risco é atender.",
      body: `Canais no mês: ERP 41%, e-commerce 34%, marketplace 16%, representantes 9%.\n\nO e-commerce (Shopify) está puxando o ${a.alias}. A venda das 11:14 (80 un) já baixou o estoque e disparou o alerta de cobertura de ${coverA}.\n\nO ERP (TOTVS) faturou 400 conexões hoje. Isso é bom para receita e ruim para o pigmento preto, já crítico.\n\nResumo: a fábrica está vendendo. A IA está pedindo para produzir A, comprar pigmento e não deixar a Linha 2 comer a margem.`,
    };
  }

  return {
    title: "Cruzei vendas, estoque, produção e custos da Atlas Polímeros.",
    body: `Situação geral: operação em atenção (saúde 72/100).\n\n• ${a.alias} com ${coverA} de estoque — produzir 1.200 un.\n• Pigmento preto em ${qty(pig.stock)} kg — comprar 500 kg.\n• Linha 2 com desperdício +14% — corrigir antes de acelerar o ${b.alias}.\n• ${c.alias} com demanda +22% e melhor margem da planta.\n\nPergunte sobre produção, estoque crítico, margem ou onde o dinheiro está saindo. Posso detalhar qualquer um desses pontos com os dados desta tela.`,
  };
}
