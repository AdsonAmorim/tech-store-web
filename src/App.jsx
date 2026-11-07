import { useEffect, useState } from 'react';
import ProductCard from './components/ProductCard.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import { useCart } from './CartContext.jsx';
import { CATEGORY_LABELS } from './format.js';
import { apiUrl } from './api.js';

const FILTERS = [['', 'Todos'], ...Object.entries(CATEGORY_LABELS)];

export default function App() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const { count, setOpen } = useCart();

  useEffect(() => {
    setLoading(true);
    setErro('');
    fetch(apiUrl(`/api/products${category ? `?category=${category}` : ''}`))
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setProducts)
      .catch(() => setErro('Não foi possível carregar os produtos. Confira se a API está no ar e a VITE_API_URL.'))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <>
      <header className="header">
        <div className="logo">
          Tech<span>Store</span>
        </div>
        <button className="cart-button" onClick={() => setOpen(true)}>
          🛒 Carrinho <span className="badge">{count}</span>
        </button>
      </header>

      <section className="hero">
        <h1>Monte o seu PC gamer</h1>
        <p>Processadores, placas de vídeo e tudo o que você precisa, com preço de oficina.</p>
      </section>

      <nav className="filters">
        {FILTERS.map(([key, label]) => (
          <button
            key={key}
            className={category === key ? 'active' : ''}
            onClick={() => setCategory(key)}
          >
            {label}
          </button>
        ))}
      </nav>

      <main className="grid">
        {loading && <p className="muted">Carregando produtos…</p>}
        {!loading && erro && <p className="muted">{erro}</p>}
        {!loading && !erro && products.map((p) => <ProductCard key={p.id} product={p} />)}
      </main>

      <CartDrawer />
    </>
  );
}
