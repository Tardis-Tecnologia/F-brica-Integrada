import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Boxes,
  PackageSearch,
  ShieldCheck,
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
    <aside className={`sidebar ${open ? "is-open" : ""}`} aria-label="Menu principal">
      <div className="brand">
        <Logo />
        <div>
          <strong>Fábrica Integrada</strong>
          <span>FLIND · Tijuca · RJ</span>
        </div>
      </div>

      <p className="nav-label">Operação</p>
      <nav>
        {items.slice(0, 4).map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.end}
            onClick={onNavigate}
            className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
          >
            <it.icon size={18} aria-hidden />
            {it.label}
          </NavLink>
        ))}
      </nav>

      <p className="nav-label">Planta e documentos</p>
      <nav>
        {items.slice(4, 5).map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            onClick={onNavigate}
            className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
          >
            <it.icon size={18} aria-hidden />
            {it.label}
          </NavLink>
        ))}
      </nav>

      <p className="nav-label">Cliente e caixa</p>
      <nav>
        {items.slice(5, 8).map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            onClick={onNavigate}
            className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
          >
            <it.icon size={18} aria-hidden />
            {it.label}
          </NavLink>
        ))}
      </nav>

      <p className="nav-label">Inteligência</p>
      <nav>
        {items.slice(8).map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            onClick={onNavigate}
            className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
          >
            <it.icon size={18} aria-hidden />
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
      <rect width="64" height="64" rx="10" fill="#1e1e59" />
      <path
        d="M18 18h16l12 14-12 14H18l12-14L18 18z"
        fill="#fff"
      />
      <path
        d="M30 18h16v28H30"
        fill="none"
        stroke="#fff"
        strokeWidth="2.2"
        opacity="0.45"
      />
    </svg>
  );
}
