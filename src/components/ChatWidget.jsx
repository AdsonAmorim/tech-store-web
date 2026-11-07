import { useEffect, useRef, useState } from 'react';
import { useCart } from '../CartContext.jsx';
import { brl, CATEGORY_ICONS } from '../format.js';
import RichText from './RichText.jsx';
import { apiUrl } from '../api.js';

const SUGESTOES = [
  'Tenho R$ 4.000 e quero montar um PC para jogar. O que você recomenda?',
  'Quero um i5 ou um Ryzen 5. Qual seria uma combinação bacana?',
  'Qual o PC mais barato que roda Valorant e CS2 bem?',
];

const BOAS_VINDAS = {
  role: 'assistant',
  content: 'Oi! Eu sou o **Tico**, consultor da TechStore. 👋\nMe conta seu orçamento e o que você quer jogar que eu monto o PC com você.',
};

export default function ChatWidget() {
  const [aberto, setAberto] = useState(false);
  const [mensagens, setMensagens] = useState([BOAS_VINDAS]);
  const [texto, setTexto] = useState('');
  const [carregando, setCarregando] = useState(false);
  const fimRef = useRef(null);

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens, carregando, aberto]);

  async function enviar(conteudo) {
    const pergunta = conteudo.trim();
    if (!pergunta || carregando) return;

    const novas = [...mensagens, { role: 'user', content: pergunta }];
    setMensagens(novas);
    setTexto('');
    setCarregando(true);

    try {
      const res = await fetch(apiUrl('/api/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Só enviamos texto. A mensagem de boas-vindas fica de fora porque é só da interface.
        body: JSON.stringify({
          messages: novas.filter((m) => m !== BOAS_VINDAS).map(({ role, content }) => ({ role, content })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Erro ao falar com o assistente');
      setMensagens((prev) => [...prev, { role: 'assistant', content: data.reply, carts: data.carts }]);
    } catch (err) {
      const msg = err instanceof TypeError ? 'Não consegui falar com a API. Confira se ela está no ar e a VITE_API_URL.' : err.message;
      setMensagens((prev) => [...prev, { role: 'assistant', content: `⚠️ ${msg}`, erro: true }]);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="chat-root">
      {aberto && (
        <section className="chat-panel" role="dialog" aria-label="Assistente de montagem">
          <header className="chat-header">
            <div className="chat-avatar">🤖</div>
            <div>
              <strong>Tico, consultor de PC</strong>
              <small>Assistente com IA · Claude</small>
            </div>
            <button className="ghost" onClick={() => setAberto(false)} aria-label="Fechar chat">✕</button>
          </header>

          <div className="chat-messages">
            {mensagens.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role} ${m.erro ? 'erro' : ''}`}>
                <div className="chat-bubble">
                  <RichText text={m.content} />
                </div>
                {m.carts?.map((cart, j) => <CarrinhoSugerido key={j} cart={cart} />)}
              </div>
            ))}

            {carregando && (
              <div className="chat-msg assistant">
                <div className="chat-bubble typing">
                  <span /><span /><span />
                  <em>consultando o catálogo…</em>
                </div>
              </div>
            )}

            {mensagens.length === 1 && !carregando && (
              <div className="chat-suggestions">
                {SUGESTOES.map((s) => (
                  <button key={s} onClick={() => enviar(s)}>{s}</button>
                ))}
              </div>
            )}
            <div ref={fimRef} />
          </div>

          <form
            className="chat-input"
            onSubmit={(e) => { e.preventDefault(); enviar(texto); }}
          >
            <input
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Ex.: tenho R$ 5 mil para jogar em 1440p"
              disabled={carregando}
              autoFocus
            />
            <button type="submit" disabled={carregando || !texto.trim()} aria-label="Enviar">➤</button>
          </form>
        </section>
      )}

      <button className="chat-fab" onClick={() => setAberto((v) => !v)} aria-label="Abrir assistente">
        {aberto ? '✕' : '💬'}
        {!aberto && <span className="chat-fab-label">Monte seu PC com IA</span>}
      </button>
    </div>
  );
}

function CarrinhoSugerido({ cart }) {
  const { addMany, setOpen } = useCart();
  const [adicionado, setAdicionado] = useState(false);
  const { compatibilidade } = cart;

  function adicionarTudo() {
    addMany(cart.itens);
    setAdicionado(true);
    setOpen(true);
  }

  return (
    <div className="suggested-cart">
      <div className="suggested-head">
        <strong>{cart.titulo}</strong>
        <span className={`compat ${compatibilidade?.compativel ? 'ok' : 'bad'}`}>
          {compatibilidade?.compativel ? '✓ compatível' : '⚠ revisar'}
        </span>
      </div>
      {cart.resumo && <p className="muted small">{cart.resumo}</p>}
      <ul>
        {cart.itens.map((item) => (
          <li key={item.id}>
            <span>{CATEGORY_ICONS[item.category]} {item.name}</span>
            <span>{brl(item.price)}</span>
          </li>
        ))}
      </ul>
      {compatibilidade?.problemas?.length > 0 && (
        <p className="small compat-problems">{compatibilidade.problemas.join(' · ')}</p>
      )}
      <div className="suggested-total">
        <span>Total</span>
        <strong>{brl(cart.total)}</strong>
      </div>
      <button onClick={adicionarTudo} disabled={adicionado}>
        {adicionado ? '✓ Adicionado ao carrinho' : 'Adicionar tudo ao carrinho'}
      </button>
    </div>
  );
}
