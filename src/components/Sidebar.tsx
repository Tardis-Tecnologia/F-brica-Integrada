import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Boxes,
  PackageSearch,
  Factory,
  ShieldCheck,
  CircleDollarSign,
  Route,
  Users,
  Wallet,
  Brain,
  MessageSquareText,
  Cable,
  LogOut,
} from "lucide-react";

const items = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/app/vendas", label: "Vendas", icon: ShoppingCart },
  { to: "/app/estoque", label: "Estoque", icon: Boxes },
  { to: "/app/compras", label: "Compras IA", icon: PackageSearch },
  { to: "/app/producao", label: "Produção", icon: Factory },
  { to: "/app/custos", label: "Custos e perdas", icon: CircleDollarSign },
  { to: "/app/conformidade", label: "Conformidade", icon: ShieldCheck },
  { to: "/app/rastreio", label: "Rastreio", icon: Route },
  { to: "/app/comercial", label: "Comercial", icon: Users },
  { to: "/app/cobrancas", label: "Cobranças", icon: Wallet },
  { to: "/app/ia", label: "Central de IA", icon: Brain },
  { to: "/app/assistente", label: "Assistente IA", icon: MessageSquareText },
  { to: "/app/integracoes", label: "Integrações", icon: Cable },
];

export function Sidebar({
  open,
  onNavigate,
}: {
  open: boolean;
  onNavigate: () => void;
}) {
  return (
    <aside className={`sidebar ${open ? "is-open" : ""}`}>
      <div className="brand">
        <Logo />
        <div>
          <strong>Fábrica Integrada</strong>
          <span>FLIND · Tijuca · RJ</span>
        </div>
      </div>

      <p className="nav-label">Operação</p>
      <nav>
        {items.slice(0, 6).map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.end}
            onClick={onNavigate}
            className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
          >
            <it.icon size={18} />
            {it.label}
          </NavLink>
        ))}
      </nav>

      <p className="nav-label">Planta e documentos</p>
      <nav>
        {items.slice(6, 7).map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            onClick={onNavigate}
            className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
          >
            <it.icon size={18} />
            {it.label}
          </NavLink>
        ))}
      </nav>

      <p className="nav-label">Cliente e caixa</p>
      <nav>
        {items.slice(7, 10).map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            onClick={onNavigate}
            className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
          >
            <it.icon size={18} />
            {it.label}
          </NavLink>
        ))}
      </nav>

      <p className="nav-label">Inteligência</p>
      <nav>
        {items.slice(10).map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            onClick={onNavigate}
            className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
          >
            <it.icon size={18} />
            {it.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-foot">
        <div className="plant-chip">
          <i />
          Planta online · MES 20s
        </div>
        <button
          className="ghost-btn"
          onClick={() => {
            sessionStorage.removeItem("fi-auth");
            window.location.hash = "#/";
          }}
        >
          <LogOut size={16} />
          Encerrar sessão
        </button>
      </div>
    </aside>
  );
}

export function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg
      className="mark"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
    >
      <rect width="64" height="64" rx="10" fill="#0B1014" />
      <path
        d="M10 46V22l22-10 22 10v24H10z"
        stroke="#3d7ea6"
        strokeWidth="2.2"
      />
      <path
        d="M22 46V30h8v16M34 46V34h8v12"
        stroke="#3EE0C4"
        strokeWidth="2.2"
      />
      <circle cx="32" cy="22" r="3" fill="#3d7ea6" />
    </svg>
  );
}
