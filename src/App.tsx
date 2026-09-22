import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { DataProvider } from "./state/DataContext";
import { AppShell } from "./components/AppShell";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Sales } from "./pages/Sales";
import { Inventory } from "./pages/Inventory";
import { Production } from "./pages/Production";
import { Costs } from "./pages/Costs";
import { AICenter } from "./pages/AICenter";
import { Assistant } from "./pages/Assistant";
import { Integrations } from "./pages/Integrations";
import { Purchases } from "./pages/Purchases";
import { Traceability } from "./pages/Traceability";
import { Collections } from "./pages/Collections";
import { TracePublic } from "./pages/TracePublic";
import type { ReactNode } from "react";

function Guard({ children }: { children: ReactNode }) {
  if (!sessionStorage.getItem("fi-auth")) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/trace/:token" element={<TracePublic />} />
        <Route
          path="/app"
          element={
            <Guard>
              <DataProvider>
                <AppShell />
              </DataProvider>
            </Guard>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="vendas" element={<Sales />} />
          <Route path="estoque" element={<Inventory />} />
          <Route path="compras" element={<Purchases />} />
          <Route path="producao" element={<Production />} />
          <Route path="custos" element={<Costs />} />
          <Route path="rastreio" element={<Traceability />} />
          <Route path="cobrancas" element={<Collections />} />
          <Route path="ia" element={<AICenter />} />
          <Route path="assistente" element={<Assistant />} />
          <Route path="integracoes" element={<Integrations />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
