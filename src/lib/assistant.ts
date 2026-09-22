import type { Material, Product } from "../data/mock";
import { coverLabel, money, pct, qty } from "./format";

export const chips = [
  "Quais produtos estão com estoque crítico?",
  "Devo comprar algum insumo?",
  "Qual o melhor fornecedor de filme PE?",
  "Onde está o pedido da Tray?",
  "Quais boletos vencem esta semana?",
  "Quais certidões vencem?",
  "Tem máquina em manutenção?",
  "Quem está no ciclo de recompra?",
  "Dispara cotação de luva no WhatsApp?",
  "Lote abaixo de 85% pode ir pro hospital?",
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

  if (q.includes("whatsapp") && (q.includes("luva") || q.includes("cota") || q.includes("rfq") || q.includes("dispara"))) {
    return {
      title: "Luva dispara para Descarpack, Medix e DKP — no WhatsApp, não em portal.",
      body: "Pergunta informal: “tem luva látex G no estoque? Qual preço você consegue colocar — não o de tabela. Qtd muda o valor.”\n\n10 a 20 cotações por dia. Foto + estoque + preço negociado. Medix e Descarpack vendem o mesmo SKU; volume fecha o valor.\n\nAbra Compras IA e clique em Luva · 3 fornecedores.",
    };
  }

  if (q.includes("85") || q.includes("lote") || q.includes("validade") || q.includes("vida útil") || q.includes("vida util")) {
    return {
      title: "Hospital só recebe lote com 85% da vida útil. Abaixo disso, carta de troca.",
      body: "Toalet 10 (lote LT-2408-TOA): 82% — abaixo. Máscara 67% e avental 66% também pedem carta. Luva 88% e Toalet 24 (5 anos) passam.\n\nSaldo de prateleira ≠ saldo real: reservado some antes da NF-e. Caixa fechada, sem fracionar.\n\nAbra Estoque → lote, caixa e validade.",
    };
  }

  if (q.includes("recompra") || q.includes("ciclo") || q.includes("abc") || q.includes("prospec") || q.includes("comercial")) {
    return {
      title: "A curva ABC já existia. O que faltava era acompanhar o ciclo.",
      body: "Hospital São Vicente: curva A, compra Toalet de 40 em 40 dias, última há 38 — janela aberta. SAMU: 45 dias, já atrasou 7. Clínica Copacabana: 30 dias, na janela.\n\nA FI manda WhatsApp/e-mail ao cliente (“seu estoque do CME deve estar no fim”) e um lembrete ao comercial no mesmo canal. Sem telefone e sem visita: 85% da prospecção é WhatsApp e e-mail.\n\nO mesmo ciclo não dispara duas vezes. Abra Comercial.",
    };
  }

  if (q.includes("certid") || q.includes("fgts") || q.includes("cnd") || q.includes("alvar") || q.includes("anvisa") || q.includes("avcb")) {
    return {
      title: "FGTS e AVCB já venceram. A IA atualiza o que o portal permite.",
      body: "Vencidas: CRF do FGTS (−4 dias) e AVCB dos Bombeiros (−2 dias). Sem FGTS a FLIND fica fora do Comprasnet.\n\nA vencer: CND Federal (13 dias), CND estadual RJ (6 dias), e-CNPJ (9 dias) e AFE/ANVISA (20 dias).\n\nA IA consulta Receita, Caixa e SEFAZ e grava o novo vencimento sozinha. AVCB, ANVISA e alvará exigem gente — a IA só alerta e abre o protocolo.\n\nAbra Conformidade e clique em Atualizar certidões com a IA.",
    };
  }

  if (q.includes("máquina") || q.includes("maquina") || q.includes("manuten") || q.includes("preventiv")) {
    return {
      title: "A solda de filme PE está atrasada — e isso explica parte do refugo.",
      body: "Solda PE (Linha Toalet): preventiva vencida há 4 dias. Combina com o desperdício da Linha Kit.\n\nSeladora Toalet: vence em 2 dias (janela amanhã 8h–12h).\n\nCompressor: 8 dias. Empacotadora EPI e empilhadeira estão em dia.\n\nA regra de aviso não é hardcoded: cada máquina tem o próprio período. Abra Conformidade para agendar a TecSolda.",
    };
  }

  if (q.includes("estoque") || q.includes("crít") || q.includes("crit")) {
    return {
      title: "Dois produtos e um insumo estão críticos agora.",
      body: `${a.alias} · ${a.name}: ${qty(a.stock)} kits / mínimo ${qty(a.minStock)} · ${coverA} de cobertura. Última venda Tray de 80 kits já entrou no saldo.\n\n${e.alias} · ${e.name}: ${qty(e.stock)} cx / mínimo ${qty(e.minStock)} · ${coverE}.\n\nInsumo: ${pig.name} com ${qty(pig.stock)} kg (mínimo ${qty(pig.minStock)} kg). Sem comprar 500 kg, a ordem de 1.200 kits Toalet fica comprometida.\n\n${b.alias} e ${c.alias} estão cobertos (cerca de ${coverLabel(b.stock, b.avgDaily)} e ${coverLabel(c.stock, c.avgDaily)}).`,
    };
  }

  if (
    q.includes("compr") ||
    q.includes("fornecedor") ||
    q.includes("filme") ||
    q.includes("pigmento") ||
    q.includes("insumo")
  ) {
    return {
      title: "Sim. O gargalo de compra é o filme PE — e o menor preço não serve.",
      body: `${pig.name}: ${qty(pig.stock)} kg / mínimo ${qty(pig.minStock)} kg · ${coverLabel(pig.stock, pig.avgDaily)} de cobertura.\n\nA campanha de 1.200 kits ${a.alias} pede 48 kg no BOM, e a Linha Kit já consome o mesmo filme. A IA calculou 500 kg para os próximos 7 dias.\n\nFornecedores comparados:\n• Plásticos Baixada · mais barato · 7 dias · chega depois da ruptura. Última negociação R$ 16,80 — sugiro negociar.\n• Filme Médico SP · 2 dias · qualidade 4,8/5 · melhor custo-benefício.\n• Plásticos Tijuca (cadastro) · 4 dias · no limite da cobertura.\n• PoliSaúde Express · 1 dia · a mais rápida, mais cara.\n\nTabela de plástico muda todo dia. Este pedido ainda fecha no preço antigo; o próximo, não. Abra Compras IA para disparar o WhatsApp ou gerar a SC.`,
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
      title: "O pedido Tray VD-8843 já está no SINK e atrasou 11 h no trânsito.",
      body: "A loja flind.com.br enviou 40 kits Toalet 10 (Hospital São Vicente). O SINK autorizou a NF-e 412.109 e gerou a etiqueta.\n\nSede do cliente: Botafogo. Entrega: CME da Urca. Sem essa distinção a Jamef entrega no CNPJ errado.\n\nLinha do tempo: Pedido → NF-e → Separação → Etiqueta → Coleta → Trânsito (agora, +11 h) → Entrega.\n\nRegras: 8h–17h, recebimento no CME, conferir lote, validade e NF-e.\n\nAbra Rastreio para gerar a etiqueta ou avisar no WhatsApp.",
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
      body: "Cliente: boleto da NF-e 412.098 (Hospital São Vicente, R$ 9.800) vence amanhã. Boleto 4408 (Clínica Tijuca) vence hoje. Fatura da Clínica Copacabana está vencida há 4 dias.\n\nInterno: provisão ICMS vence hoje e o título da farmácia hospitalar vence em 25/09.\n\nO WhatsApp Business já tem 3 mensagens prontas: cobrança, rastreio atrasado e alerta para a expedição da Tijuca.\n\nAbra Cobranças para disparar.",
    };
  }

  if (q.includes("perdendo") || q.includes("desperd") || q.includes("dinheiro")) {
    return {
      title: "A perda visível está na Linha Kit, não no volume de vendas.",
      body: `O desperdício da Linha Kit subiu 14% em 7 dias e levou o custo do ${b.alias} a ${money(b.unitCost, true)}. Cada ponto percentual extra de refugo nessa linha custa cerca de R$ 16 mil/mês.\n\nA margem da planta caiu de 36,1% para 32,8% — a maior parte vem da selagem do saco Toalet, não de preço.\n\nA ${c.alias} é o oposto: margem de ${pct(((c.price - c.unitCost) / c.price) * 100)} e demanda +22%.\n\nAção: qualidade na Linha Kit primeiro; depois produzir Toalet 10 e priorizar máscara.`,
    };
  }

  if (q.includes("margem") || q.includes("caiu") || q.includes("custo")) {
    return {
      title: "A margem caiu 3,3 p.p. porque o custo do Toalet 24 subiu.",
      body: `Margem atual: 32,8% · anterior: 36,1%.\n\nO ${b.alias} teve custo unitário em alta com o desperdício da Linha Kit em 8,4%. Volume alto (${qty(b.avgDaily)} cx/dia) puxa o consolidado.\n\nFaturamento segue firme — o problema não é demanda. É eficiência da selagem.\n\nA ${c.alias} permanece com margem ${pct(((c.price - c.unitCost) / c.price) * 100)} e deveria ganhar fila na Linha EPI.`,
    };
  }

  if ((q.includes("produzir") || q.includes("produção") || q.includes("producao")) && (q.includes("semana") || q.includes("precis"))) {
    return {
      title: "Sim. Há três movimentos de produção nesta semana.",
      body: `O ${a.alias} (${a.name}) está com ${qty(a.stock)} kits — cobertura de ${coverA}, abaixo do mínimo de ${qty(a.minStock)}. Recomendo produzir 1.200 kits na Linha Toalet.\n\nA ${e.alias} também pede antecipação: ${qty(e.stock)} cx, ${coverE} de cobertura. Ampliar a OP-2406 para 700 cx resolve.\n\nAntes de acelerar o ${b.alias} na Linha Kit, corrija o desperdício da selagem (+14% em 7 dias).`,
    };
  }

  if (q.includes("produção") || q.includes("producao") || q.includes("minha produ")) {
    return {
      title: "Produção está operacional, com um ponto vermelho na Linha Kit.",
      body: `Linha Toalet: OP-2411 de 600 kits na fila — insuficiente frente à cobertura de ${coverA}.\n\nLinha Kit: OP-2412 em execução (3.200 caixas 24) com eficiência 81% e desperdício 8,4%. A OP-2404 atrasou (OEE 61%).\n\nLinha EPI: máscara concluída (OEE 86%) e luva em setup.\n\nOEE planta: 74,2%. O gargalo é qualidade da selagem + falta de filme PE para a campanha do Toalet.`,
    };
  }

  if (q.includes("venda") || q.includes("pedido") || q.includes("e-commerce") || q.includes("ecommerce")) {
    return {
      title: "As vendas estão saudáveis — o risco é atender hospital e licitação.",
      body: `Canais no mês: Tray 42%, ERP/B2B 30%, licitação (Comprasnet) 19%, representantes 9%.\n\nA loja flind.com.br está puxando o ${a.alias}. A venda das 11:14 (80 kits) já baixou o estoque.\n\nO SINK faturou 400 caixas Toalet 24 hoje (hospital). Isso é bom para receita e ruim para o filme PE, já crítico.\n\nResumo: a FLIND está vendendo. A IA pede produzir Toalet 10, comprar filme e não deixar a Linha Kit comer a margem.`,
    };
  }

  return {
    title: "Cruzei vendas, estoque, produção e custos da FLIND.",
    body: `Situação geral: operação em atenção (saúde 72/100).\n\n• ${a.alias} com ${coverA} de estoque — produzir 1.200 kits.\n• Filme PE em ${qty(pig.stock)} kg — comprar 500 kg.\n• Linha Kit com desperdício +14% — corrigir selagem.\n• ${c.alias} com demanda +22% e melhor margem.\n\nPergunte sobre produção, estoque crítico, margem ou onde o dinheiro está saindo.`,
  };
}
