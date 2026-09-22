import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useData } from "../state/DataContext";

const titles: Record<string, { title: string; subtitle: string }> = {
  "/app": {
    title: "Dashboard executivo",
    subtitle: "Operação e caixa em um só lugar · dados de protótipo",
  },
  "/app/vendas": {
    title: "Vendas e pedidos",
    subtitle: "Pedidos Tray, SINK, marketplace e representantes — tudo simulado",
  },
  "/app/estoque": {
    title: "Estoque e insumos",
    subtitle: "Saldo, cobertura e consumo cruzados com a demanda real",
  },
  "/app/compras": {
    title: "Compras inteligentes",
    subtitle: "A IA calcula o que falta, compara fornecedores e recomenda a melhor compra — não a mais barata",
  },
  "/app/producao": {
    title: "Produção",
    subtitle: "Ordens, linhas, eficiência e desperdício do chão de fábrica",
  },
  "/app/custos": {
    title: "Custos e desperdícios",
    subtitle: "Onde o custo sobe, onde a margem foge e o efeito do refugo",
  },
  "/app/rastreio": {
    title: "Rastreio e etiquetas",
    subtitle: "Timeline, etiqueta com QR e endereço de descarga ≠ sede",
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
    subtitle: "Pergunte em linguagem natural sobre a operação da Atlas Polímeros",
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
