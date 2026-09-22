import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  alerts as seedAlerts,
  company,
  kpisSeed,
  materials as seedMaterials,
  productionOrders as seedOrders,
  products as seedProducts,
  recommendations as seedRecs,
  sales as seedSales,
  type Alert,
  type Material,
  type Product,
  type ProductionOrder,
  type Recommendation,
  type Sale,
} from "../data/mock";
import { daysCover, money, nowClock } from "../lib/format";
import { liveQty, quotesFor, rankQuotes, ruptureDaysOf } from "../lib/purchases";
import { needSeeds } from "../data/purchases";
import {
  applyAiCertificateRefresh,
  certificatesSeed,
  machinesSeed,
  type Certificate,
  type Machine,
} from "../data/compliance";
import { accountsSeed, cycleFlag, type Account } from "../data/crm";
import { rfqGroups } from "../data/opsExtra";

export type Toast = { id: string; text: string } | null;

export type PurchaseRequest = {
  id: string;
  materialId: string;
  materialName: string;
  quoteId: string;
  supplierName: string;
  qty: number;
  total: number;
  leadDays: number;
};

type DataCtx = {
  products: Product[];
  materials: Material[];
  sales: Sale[];
  orders: ProductionOrder[];
  recs: Recommendation[];
  alerts: Alert[];
  kpis: typeof kpisSeed;
  purchaseRequests: PurchaseRequest[];
  toast: Toast;
  livePulse: boolean;
  simulateSale: () => void;
  applyRec: (id: string) => void;
  createPurchase: (p: Omit<PurchaseRequest, "id">) => void;
  certificates: Certificate[];
  machines: Machine[];
  refreshCertificates: () => void;
  accounts: Account[];
  fireRepurchase: (id: string, target: "whatsapp" | "team" | "both") => void;
  fireRfq: (groupId: string) => void;
  ping: (text: string) => void;
  clearToast: () => void;
};

const Ctx = createContext<DataCtx | null>(null);

function clone<T>(v: T): T {
  return structuredClone(v);
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState(() => clone(seedProducts));
  const [materials, setMaterials] = useState(() => clone(seedMaterials));
  const [sales, setSales] = useState(() => clone(seedSales));
  const [orders, setOrders] = useState(() => clone(seedOrders));
  const [recs, setRecs] = useState(() => clone(seedRecs));
  const [alerts, setAlerts] = useState(() => clone(seedAlerts));
  const [kpis, setKpis] = useState({ ...kpisSeed });
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
  const [toast, setToast] = useState<Toast>(null);
  const [livePulse, setLivePulse] = useState(false);
  const [saleSeq, setSaleSeq] = useState(8842);
  const [scSeq, setScSeq] = useState(1042);
  const [certificates, setCertificates] = useState(() => clone(certificatesSeed));
  const [machines] = useState(() => clone(machinesSeed));
  const [accounts, setAccounts] = useState(() => clone(accountsSeed));

  const refreshCertificates = () => {
    const next = applyAiCertificateRefresh(certificates);
    const auto = next.filter((c, i) => c.auto && c.status === "ok" && certificates[i].status !== "ok").length;
    const human = next.filter((c) => c.status === "pending").length;
    setCertificates(next);
    setAlerts((a) => [
      {
        id: `al-cert-${Date.now()}`,
        time: nowClock(),
        tone: human ? "atencao" : "ok",
        title: "IA atualizou as certidões nos portais",
        detail: `${auto} documento(s) renovados automaticamente. ${human} exigem gente (AVCB, ANVISA, e-CNPJ).`,
        source: "Conformidade + IA",
      },
      ...a,
    ]);
    setToast({
      id: "cert-ai",
      text: `IA consultou Receita, Caixa e SEFAZ. Renovou o que dava. AVCB e ANVISA ficaram com o responsável.`,
    });
  };

  const fireRepurchase = (id: string, target: "whatsapp" | "team" | "both") => {
    const acc = accounts.find((a) => a.id === id);
    if (!acc || acc.alerted) return;
    if (cycleFlag(acc.lastBuyDays, acc.cycleDays) === "cedo") return;
    setAccounts((list) => list.map((a) => (a.id === id ? { ...a, alerted: true } : a)));
    const toClient =
      target !== "team"
        ? `WhatsApp/e-mail a ${acc.name}: reposição de ${acc.product} (ciclo ${acc.cycleDays} dias). ${acc.stockHint}`
        : "";
    const toTeam =
      target !== "whatsapp"
        ? `Lembrete ${acc.owner}: falar com ${acc.name} no ${acc.channel} — não ligar.`
        : "";
    setAlerts((a) => [
      {
        id: `al-crm-${Date.now()}`,
        time: nowClock(),
        tone: "atencao",
        title: `Recompra ${acc.name}`,
        detail: [toClient, toTeam].filter(Boolean).join(" "),
        source: "Comercial · ciclo ABC",
      },
      ...a,
    ]);
    setToast({
      id: `crm-${id}`,
      text: target === "team" ? toTeam : target === "whatsapp" ? toClient : `${toClient} ${toTeam}`,
    });
  };

  const fireRfq = (groupId: string) => {
    const g = rfqGroups.find((x) => x.id === groupId);
    if (!g) return;
    setAlerts((a) => [
      {
        id: `al-rfq-${Date.now()}`,
        time: nowClock(),
        tone: "info",
        title: `Cotação WhatsApp · ${g.label}`,
        detail: `Disparo para ${g.suppliers.join(", ")}: “${g.ask}” Preço de tabela não vale — a lista muda todo dia.`,
        source: "Compras · RFQ WhatsApp",
      },
      ...a,
    ]);
    setToast({
      id: `rfq-${g.id}`,
      text: `WhatsApp enviado a ${g.suppliers.length} fornecedores de ${g.label.toLowerCase()}. Pedindo estoque e preço negociado.`,
    });
  };

  const simulateSale = () => {
    const product = products.find((p) => p.id === "atl-a");
    if (!product) return;
    const qty = 80;
    const value = qty * product.price;
    const id = `VD-${saleSeq}`;
    const time = nowClock();

    const nextProducts = products.map((p) =>
      p.id === "atl-a" ? { ...p, stock: Math.max(0, p.stock - qty) } : p,
    );
    const a = nextProducts.find((p) => p.id === "atl-a")!;
    const cover = daysCover(a.stock, a.avgDaily);

    const sale: Sale = {
      id,
      date: "2026-09-22",
      time,
      productId: "atl-a",
      qty,
      channel: "E-commerce",
      origin: "Tray",
      value,
      status: "Novo",
    };

    const alert: Alert = {
      id: `al-${Date.now()}`,
      time,
      tone: "critico",
      title: "Nova venda Tray reduziu o Toalet 10",
      detail: `${id} · 80 kits Toalet + suporte. Estoque agora ${a.stock} · cobertura ${cover.toLocaleString("pt-BR", { maximumFractionDigits: 1, minimumFractionDigits: 1 })} dias.`,
      source: "Tray → Estoque",
    };

    setProducts(nextProducts);
    setSales((s) => [sale, ...s]);
    setAlerts((a) => [
      alert,
      {
        id: `al-buy-${Date.now()}`,
        time,
        tone: "atencao",
        title: "Compras IA: filme PE insuficiente para repor o Toalet",
        detail: "A venda acelera a ordem de 1.200 kits. O BOM pede filme PE, já com 4,3 dias de cobertura. Abrir Compras Inteligentes para comparar fornecedores.",
        source: "Venda → Produção → Compras",
      },
      ...a,
    ]);
    setKpis((k) => ({
      ...k,
      revenue: k.revenue + value,
      orders: k.orders + 1,
    }));
    setSaleSeq((n) => n + 1);
    setLivePulse(true);
    setToast({
      id,
      text: `Venda ${id} integrou a loja Tray. Estoque do Toalet 10 atualizado · IA recalculou cobertura e a necessidade de filme PE.`,
    });
    window.setTimeout(() => setLivePulse(false), 4200);
  };

  const createPurchase = (p: Omit<PurchaseRequest, "id">) => {
    if (purchaseRequests.some((x) => x.materialId === p.materialId)) return;
    const scId = `SC-${scSeq}`;
    const row: PurchaseRequest = { id: scId, ...p };
    setPurchaseRequests((ps) => [row, ...ps]);
    setScSeq((n) => n + 1);
    setRecs((rs) =>
      rs.map((r) =>
        r.actionKind === "compra" && r.relatedMaterialId === p.materialId
          ? { ...r, applied: true }
          : r,
      ),
    );
    setAlerts((a) => [
      {
        id: `al-sc-${Date.now()}`,
        time: nowClock(),
        tone: "ok",
        title: `Solicitação ${scId} gerada`,
        detail: `${p.qty} kg de ${p.materialName} · ${p.supplierName} · entrega em ${p.leadDays} dias · ${p.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}.`,
        source: "Compras Inteligentes",
      },
      ...a,
    ]);
    setToast({
      id: scId,
      text: `${scId} gerada · ${p.supplierName} · ${p.qty} kg · entrega em ${p.leadDays} dias.`,
    });
  };

  const applyRec = (id: string) => {
    const rec = recs.find((r) => r.id === id);
    if (!rec || rec.applied) return;

    if (rec.actionKind === "producao" && rec.relatedProductId && rec.qty) {
      const product = products.find((p) => p.id === rec.relatedProductId);
      const order: ProductionOrder = {
        id: `OP-${2413 + orders.filter((o) => o.id.startsWith("OP-24")).length}`,
        productId: rec.relatedProductId,
        qty: rec.qty,
        line: product?.line ?? "Linha 1",
        status: "Fila",
        start: "hoje · imediato",
        due: "23/09 18:00",
        cost: (product?.unitCost ?? 0) * rec.qty,
        efficiency: 0,
        wastePct: 0,
        oee: 0,
      };
      setOrders((o) => [order, ...o]);
      setToast({
        id: order.id,
        text: `${rec.action} · ${order.id} enviada ao MES da ${order.line}.`,
      });
    }

    if (rec.actionKind === "compra" && rec.relatedMaterialId) {
      const material = materials.find((m) => m.id === rec.relatedMaterialId);
      const seed = needSeeds.find((n) => n.materialId === rec.relatedMaterialId);
      if (material && seed) {
        const buy = rec.qty ?? liveQty(seed.baseQty, material.id, products, orders);
        const ranked = rankQuotes(quotesFor(material.id), buy, ruptureDaysOf(material));
        const best = ranked.find((r) => r.bestValue) ?? ranked[0];
        createPurchase({
          materialId: material.id,
          materialName: material.name,
          quoteId: best.quote.id,
          supplierName: best.quote.supplierName,
          qty: buy,
          total: best.total,
          leadDays: best.quote.leadDays,
        });
      }
    }

    if (rec.actionKind === "qualidade") {
      setToast({
        id,
        text: "Ação de qualidade aberta na Linha Kit · selagem do saco Toalet e lote com falha de vedação.",
      });
    }

    if (rec.actionKind === "prioridade") {
      setToast({
        id,
        text: "Máscara Medix priorizada na Linha EPI após a campanha do Toalet 10.",
      });
    }

    setRecs((rs) => rs.map((r) => (r.id === id ? { ...r, applied: true } : r)));
    setAlerts((a) => [
      {
        id: `al-act-${Date.now()}`,
        time: nowClock(),
        tone: "ok",
        title: "Ação da IA executada",
        detail: rec.action,
        source: "Central de IA",
      },
      ...a,
    ]);
  };

  const value = useMemo(
    () => ({
      products,
      materials,
      sales,
      orders,
      recs,
      alerts,
      kpis,
      purchaseRequests,
      toast,
      livePulse,
      simulateSale,
      applyRec,
      certificates,
      machines,
      refreshCertificates,
      accounts,
      fireRepurchase,
      fireRfq,
      createPurchase,
      ping: (text: string) => setToast({ id: `n-${Date.now()}`, text }),
      clearToast: () => setToast(null),
    }),
    [products, materials, sales, orders, recs, alerts, kpis, purchaseRequests, toast, livePulse, certificates, machines, accounts],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useData() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useData outside provider");
  return v;
}

export { company };
