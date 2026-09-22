import { Link, useParams } from "react-router-dom";
import { shipments, trackStages } from "../data/commerce";
import { Logo } from "../components/Sidebar";

export function TracePublic() {
  const { token } = useParams();
  const ship = shipments.find((s) => s.token === token);
  const current = ship ? trackStages.indexOf(ship.stage) : -1;

  return (
    <div className="trace-public">
      <header className="trace-pub-head">
        <Logo size={36} />
        <div>
          <p className="kicker">Rastreio autorizado</p>
          <strong>Fábrica Integrada · Atlas Polímeros</strong>
        </div>
      </header>

      {!ship ? (
        <div className="panel pad">
          <h2>Token inválido</h2>
          <p className="muted">Este QR não encontrou embarque. Peça uma etiqueta nova à expedição.</p>
        </div>
      ) : (
        <div className="stack">
          <div className="panel pad">
            <p className="kicker">Pedido {ship.saleId}</p>
            <h2>
              NF-e {ship.nfe} · {ship.client}
            </h2>
            <p className="muted">
              {ship.carrier} · {ship.tracking} · {ship.volumes} volume(s)
            </p>
            <p className="insight">{ship.note}</p>
          </div>
          <div className="panel pad">
            <p className="kicker">Linha do tempo</p>
            <div className="track">
              {trackStages.map((st, i) => (
                <div
                  key={st}
                  className={`track-step ${i < current ? "done" : ""} ${i === current ? "now" : ""} ${
                    i === current && ship.delayHours > 0 ? "late" : ""
                  }`}
                >
                  <i />
                  <strong>{st}</strong>
                  <small>{i < current ? "ok" : i === current ? "agora" : "fila"}</small>
                </div>
              ))}
            </div>
          </div>
          <div className="panel pad">
            <p className="kicker">Entrega (não é a sede)</p>
            <p>{ship.deliveryAddress}</p>
            <p className="hint">Regras: {ship.rules.join(" · ")}</p>
          </div>
        </div>
      )}

      <p className="fine">
        Protótipo · o QR leva só o token, não o CNPJ.{" "}
        <Link to="/">Voltar ao login</Link>
      </p>
    </div>
  );
}
