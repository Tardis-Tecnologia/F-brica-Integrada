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
      origin: "Shopify",
      value,
      status: "Novo",
    };

    const alert: Alert = {
      id: `al-${Date.now()}`,
      time,
      tone: "critico",
      title: "Nova venda e-commerce reduziu o Produto A",
      detail: `${id} · 80 un do Reservatório 20 L. Estoque agora ${a.stock} un · cobertura ${cover.toLocaleString("pt-BR", { maximumFractionDigits: 1, minimumFractionDigits: 1 })} dias.`,
      source: "E-commerce → Estoque",
    };

    setProducts(nextProducts);
    setSales((s) => [sale, ...s]);
    setAlerts((a) => [
      alert,
      {
        id: `al-buy-${Date.now()}`,
        time,
        tone: "atencao",
        title: "Compras IA: pigmento insuficiente para repor o Produto A",
        detail: "A venda acelera a ordem de 1.200 un. O BOM pede pigmento preto, já com 4,3 dias de cobertura. Abrir Compras Inteligentes para comparar fornecedores.",
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
      text: `Venda ${id} integrou o e-commerce. Estoque do Produto A atualizado · IA recalculou cobertura e a necessidade de pigmento.`,
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
        text: "Ação de qualidade aberta na Linha 2 · setup térmico e molde da conexão 50 mm.",
      });
    }

    if (rec.actionKind === "prioridade") {
      setToast({
        id,
        text: "Produto C priorizado na fila da Linha 1 após a campanha do Reservatório 20 L.",
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
      createPurchase,
      ping: (text: string) => setToast({ id: `n-${Date.now()}`, text }),
      clearToast: () => setToast(null),
    }),
    [products, materials, sales, orders, recs, alerts, kpis, purchaseRequests, toast, livePulse],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useData() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useData outside provider");
  return v;
}

export { company };
