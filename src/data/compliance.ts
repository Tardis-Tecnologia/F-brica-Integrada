export type ComplianceStatus = "ok" | "soon" | "overdue" | "pending";

export type Certificate = {
  id: string;
  name: string;
  issuer: string;
  number: string;
  expires: string;
  days: number;
  status: ComplianceStatus;
  auto: boolean;
  owner: string;
  note: string;
};

export type Machine = {
  id: string;
  name: string;
  line: string;
  kind: string;
  lastService: string;
  nextService: string;
  days: number;
  hoursLeft: number;
  status: ComplianceStatus;
  vendor: string;
  note: string;
};

export const certificatesSeed: Certificate[] = [
  {
    id: "cnd-fed",
    name: "CND Federal",
    issuer: "Receita Federal",
    number: "CND-2026-441902",
    expires: "05/10/2026",
    days: 13,
    status: "soon",
    auto: true,
    owner: "Financeiro",
    note: "A IA consulta o portal da Receita e renova o vencimento quando a certidão é emitida.",
  },
  {
    id: "fgts",
    name: "CRF · FGTS",
    issuer: "Caixa Econômica",
    number: "CRF-208119",
    expires: "18/09/2026",
    days: -4,
    status: "overdue",
    auto: true,
    owner: "Financeiro",
    note: "Venceu. Sem CRF válido a FLIND não participa de licitação no Comprasnet.",
  },
  {
    id: "cndt",
    name: "CNDT trabalhista",
    issuer: "TST",
    number: "CNDT-77102",
    expires: "10/12/2026",
    days: 79,
    status: "ok",
    auto: true,
    owner: "RH",
    note: "Consulta automática no TST. Sem pendência.",
  },
  {
    id: "cnd-rj",
    name: "CND estadual RJ",
    issuer: "SEFAZ-RJ",
    number: "SEFAZ-4411",
    expires: "28/09/2026",
    days: 6,
    status: "soon",
    auto: true,
    owner: "Financeiro",
    note: "Faltam 6 dias. A IA já deixou o alerta no financeiro.",
  },
  {
    id: "alvara",
    name: "Alvará de funcionamento",
    issuer: "Prefeitura do Rio",
    number: "ALV-TIJ-085",
    expires: "30/11/2026",
    days: 69,
    status: "ok",
    auto: false,
    owner: "Administrativo",
    note: "Renovação presencial. A IA só avisa; não emite sozinha.",
  },
  {
    id: "avcb",
    name: "AVCB · Bombeiros",
    issuer: "CBMERJ",
    number: "AVCB-19.440",
    expires: "20/09/2026",
    days: -2,
    status: "overdue",
    auto: false,
    owner: "Facilities",
    note: "Venceu. Exige vistoria. A IA não atualiza — agenda o responsável.",
  },
  {
    id: "anvisa",
    name: "AFE / ANVISA",
    issuer: "ANVISA",
    number: "AFE-7.902.118",
    expires: "12/10/2026",
    days: 20,
    status: "soon",
    auto: false,
    owner: "Qualidade",
    note: "Produto hospitalar. Protocolo humano. A IA só acompanha o prazo.",
  },
  {
    id: "ecnpj",
    name: "e-CNPJ A1",
    issuer: "AC Certificadora",
    number: "A1-FLIND-2026",
    expires: "01/10/2026",
    days: 9,
    status: "soon",
    auto: true,
    owner: "TI",
    note: "Sem certificado válido a NF-e e o SINK param.",
  },
  {
    id: "sismicat",
    name: "SISMICAT",
    issuer: "Forças Armadas",
    number: "CAT-ONU-2018",
    expires: "01/03/2027",
    days: 160,
    status: "ok",
    auto: false,
    owner: "Comercial",
    note: "Catalogação militar. Renovação anual com documentação.",
  },
];

export const machinesSeed: Machine[] = [
  {
    id: "sol-pe",
    name: "Solda de filme PE",
    line: "Linha Toalet",
    kind: "Preventiva 90 dias",
    lastService: "20/06/2026",
    nextService: "18/09/2026",
    days: -4,
    hoursLeft: 0,
    status: "overdue",
    vendor: "TecSolda RJ",
    note: "Atraso de 4 dias. Combina com o refugo da selagem na Linha Kit.",
  },
  {
    id: "sel-toa",
    name: "Seladora de kit Toalet",
    line: "Linha Kit",
    kind: "Preventiva 60 dias",
    lastService: "26/07/2026",
    nextService: "24/09/2026",
    days: 2,
    hoursLeft: 18,
    status: "soon",
    vendor: "TecSolda RJ",
    note: "Janela amanhã 8h–12h. Sem parada programada a linha perde a manhã.",
  },
  {
    id: "com-01",
    name: "Compressor de ar",
    line: "Utilidades",
    kind: "Preventiva 180 dias",
    lastService: "02/04/2026",
    nextService: "30/09/2026",
    days: 8,
    hoursLeft: 120,
    status: "soon",
    vendor: "Atlas Copco serviço",
    note: "Filtros e óleo. Aviso 8 dias antes, não hardcoded — regra da planta.",
  },
  {
    id: "emp-epi",
    name: "Empacotadora EPI",
    line: "Linha EPI",
    kind: "Preventiva 120 dias",
    lastService: "18/06/2026",
    nextService: "15/10/2026",
    days: 23,
    hoursLeft: 340,
    status: "ok",
    vendor: "PackMed",
    note: "Dentro do período. Próxima revisão em outubro.",
  },
  {
    id: "emp-02",
    name: "Empilhadeira 2,5 t",
    line: "Expedição",
    kind: "NR-12 + horímetro",
    lastService: "08/08/2026",
    nextService: "08/11/2026",
    days: 47,
    hoursLeft: 210,
    status: "ok",
    vendor: "Movicarga Tijuca",
    note: "Horímetro e laudo de segurança em dia.",
  },
];

export function statusLabel(s: ComplianceStatus) {
  if (s === "overdue") return "Vencido";
  if (s === "soon") return "Vence em breve";
  if (s === "pending") return "Aguardando gente";
  return "Em dia";
}

export function applyAiCertificateRefresh(list: Certificate[]) {
  return list.map((c) => {
    if (c.id === "fgts") {
      return { ...c, expires: "18/10/2026", days: 26, status: "ok" as const, note: "IA consultou a Caixa e atualizou o CRF automaticamente." };
    }
    if (c.id === "cnd-fed") {
      return { ...c, expires: "04/01/2027", days: 104, status: "ok" as const, note: "IA emitiu nova CND na Receita e gravou o vencimento." };
    }
    if (c.id === "cnd-rj") {
      return { ...c, expires: "28/12/2026", days: 97, status: "ok" as const, note: "IA atualizou a CND estadual no portal da SEFAZ-RJ." };
    }
    if (c.id === "ecnpj") {
      return { ...c, status: "pending" as const, note: "IA viu o vencimento. Renovação A1 exige token do responsável de TI." };
    }
    if (!c.auto && (c.status === "overdue" || c.status === "soon")) {
      return { ...c, status: "pending" as const, note: `${c.note} Protocolo aberto para ${c.owner}.` };
    }
    return c;
  });
}
