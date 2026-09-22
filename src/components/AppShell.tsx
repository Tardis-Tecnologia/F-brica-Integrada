import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useData } from "../state/DataContext";

const titles: Record<string, { title: string; subtitle: string }> = {
  "/app": {
    title: "Dashboard executivo",
    subtitle: "Toalet, EPIs e caixa da FLIND · dados de protótipo",
  },
  "/app/vendas": {
    title: "Vendas e pedidos",
    subtitle: "Pedido → estoque → compra · sede ≠ entrega · frete % da venda",
  },
  "/app/estoque": {
    title: "Estoque e insumos",
    subtitle: "Reservado vs NF-e · lote 85% · catálogo por segmento e Tray",
  },
  "/app/compras": {
    title: "Compras inteligentes",
    subtitle: "WhatsApp por categoria · última negociação · não o preço de tabela",
  },
  "/app/producao": {
    title: "Produção",
    subtitle: "Ordens, linhas, eficiência e desperdício do chão de fábrica",
  },
  "/app/custos": {
    title: "Custos e desperdícios",
    subtitle: "Onde o custo sobe, onde a margem foge e o efeito do refugo",
  },
  "/app/conformidade": {
    title: "Conformidade",
    subtitle: "Manutenção de máquinas e renovação de certidões — a IA atualiza o que o portal permite",
  },
  "/app/rastreio": {
    title: "Rastreio e etiquetas",
    subtitle: "Timeline, etiqueta com QR e endereço de descarga ≠ sede",
  },
  "/app/comercial": {
    title: "Comercial e recompra",
    subtitle: "ABC + ciclo do cliente · alerta de estoque no WhatsApp/e-mail e lembrete ao time",
  },
  "/app/cobrancas": {
    title: "Alertas de pagamento",
    subtitle: "Aging, regras D-5…D+7 e fila WhatsApp — mock do SINK",
  },
  "/app/ia": {
    title: "Central de IA",
    subtitle: "A fábrica cruzou os dados. Aqui está o que fazer agora.",
  },
  "/app/assistente": {
    title: "Assistente IA",
    subtitle: "Pergunte sobre Toalet, estoque, filme PE, Tray ou boletos da FLIND",
  },
  "/app/integracoes": {
    title: "Integrações",
    subtitle: "Tray, SINK ERP e WhatsApp Business simulados nesta camada central",
  },
};

export function AppShell() {
  const { pathname } = useLocation();
  const { toast, clearToast } = useData();
  const [open, setOpen] = useState(false);
  const page = titles[pathname] ?? titles["/app"];

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(clearToast, 5200);
    return () => window.clearTimeout(t);
  }, [toast, clearToast]);

  return (
    <div className="shell">
      <Sidebar open={open} onNavigate={() => setOpen(false)} />
      {open ? <div className="scrim" onClick={() => setOpen(false)} /> : null}
      <div className="main">
        <Topbar
          title={page.title}
          subtitle={page.subtitle}
          onMenu={() => setOpen(true)}
        />
        <div className="page">
          <Outlet />
        </div>
      </div>
      {toast ? <div className="toast">{toast.text}</div> : null}
    </div>
  );
}
