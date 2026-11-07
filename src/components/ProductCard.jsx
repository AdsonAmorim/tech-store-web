import { useCart } from '../CartContext.jsx';
import { brl, CATEGORY_ICONS, CATEGORY_LABELS } from '../format.js';

export default function ProductCard({ product }) {
  const { add } = useCart();
  const specs = [product.socket, product.ram_type, product.watts && `${product.watts}W`].filter(Boolean);

  return (
    <article className="card">
      <div className="card-image">{CATEGORY_ICONS[product.category]}</div>
      <span className="tag">{CATEGORY_LABELS[product.category]}</span>
      <h3>{product.name}</h3>
      {specs.length > 0 && <p className="specs">{specs.join(' · ')}</p>}
      {product.description && <p className="description">{product.description}</p>}
      <strong className="price">{brl(product.price)}</strong>
      <small className="muted">à vista no PIX</small>
      <button onClick={() => add(product)}>Adicionar ao carrinho</button>
    </article>
  );
}
