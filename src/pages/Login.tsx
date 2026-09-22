import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components/Sidebar";
import { company } from "../data/mock";

export function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState(company.email);
  const [password, setPassword] = useState("flind2026");
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
          <p className="kicker">FLIND · higiene e segurança</p>
          <h1>Toalet, EPI e hospital em uma decisão só.</h1>
          <p>
            A Fábrica Integrada cruza a loja Tray, o SINK, o estoque da Tijuca e a
            linha Toalet — e recomenda o que fazer agora.
          </p>
          <ul className="login-points">
            <li>Pedido Tray → estoque reage</li>
            <li>Filme PE, gel e TNT cruzados com o BOM</li>
            <li>IA aponta ruptura, lote e ação</li>
          </ul>
        </div>
      </div>
      <form className="login-card" onSubmit={enter}>
        <p className="kicker">Acesso à planta</p>
        <h2>Entrar na Fábrica Integrada</h2>
        <p className="muted">
          Unidade Tijuca · {company.short}
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
          Protótipo · dados simulados da FL Indústria (Toalet, EPIs e loja Tray).
        </p>
      </form>
    </div>
  );
}
