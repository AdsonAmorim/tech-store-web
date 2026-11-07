import { useCart } from '../CartContext.jsx';
import { brl } from '../format.js';

export default function CartDrawer() {
  const { items, remove, clear, total, open, setOpen } = useCart();

  return (
    <>
      {open && <div className="overlay" onClick={() => setOpen(false)} />}
      <aside className={`drawer ${open ? 'open' : ''}`}>
        <div className="drawer-head">
          <h2>Seu carrinho</h2>
          <button className="ghost" onClick={() => setOpen(false)} aria-label="Fechar">✕</button>
        </div>

        {items.length === 0 && <p className="muted">Seu carrinho está vazio.</p>}

        {items.map((item) => (
          <div key={item.id} className="drawer-item">
            <div>
              <p>{item.qty}× {item.name}</p>
              <small className="muted">{brl(item.price * item.qty)}</small>
            </div>
            <button className="ghost" onClick={() => remove(item.id)} aria-label="Remover">🗑</button>
          </div>
        ))}

        <div className="drawer-footer">
          <div className="drawer-total">
            <span>Total</span>
            <strong>{brl(total)}</strong>
          </div>
          <button disabled={!items.length}>Finalizar compra</button>
          {items.length > 0 && (
            <button className="ghost" onClick={clear}>Esvaziar carrinho</button>
          )}
        </div>
      </aside>
    </>
  );
}
