import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components/Sidebar";
import { company } from "../data/mock";

export function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState(company.email);
  const [password, setPassword] = useState("atlas2026");
  const [err, setErr] = useState("");

  const enter = (e?: FormEvent) => {
    e?.preventDefault();
    if (!email || !password) {
      setErr("Informe e-mail e senha para acessar a planta.");
      return;
    }
    sessionStorage.setItem("fi-auth", "1");
    nav("/app");
  };

  return (
    <div className="login">
      <div className="login-art">
        <div className="login-grid" />
        <div className="login-copy">
          <Logo size={48} />
          <p className="kicker">Plataforma industrial</p>
          <h1>A fábrica inteira, em uma decisão só.</h1>
          <p>
            A Fábrica Integrada reúne e-commerce, ERP, estoque, produção, custos e
            desperdícios — e recomenda ao gestor o que fazer agora.
          </p>
          <ul className="login-points">
            <li>Venda entra → estoque reage</li>
            <li>Insumos e linhas são cruzados</li>
            <li>IA aponta ruptura, custo e ação</li>
          </ul>
        </div>
      </div>
      <form className="login-card" onSubmit={enter}>
        <p className="kicker">Acesso à planta</p>
        <h2>Entrar na Fábrica Integrada</h2>
        <p className="muted">
          Unidade Joinville · {company.short}
        </p>
        <label>
          E-mail corporativo
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Senha
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {err ? <p className="form-err">{err}</p> : null}
        <button className="primary" type="submit">
          Acessar dashboard
        </button>
        <button className="secondary" type="button" onClick={() => enter()}>
          Entrar na demonstração
        </button>
        <p className="fine">
          Protótipo de apresentação · dados simulados coerentes da Atlas Polímeros.
        </p>
      </form>
    </div>
  );
}
