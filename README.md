# TechStore Web

Front da TechStore, o mini e-commerce de hardware da oficina **"Construindo um agente de IA dentro de um e-commerce"**. É feito em React com Vite.

A API fica no repositório **techstore-api**.

## Branches

| Branch | O que tem |
|---|---|
| `app-base` | Vitrine, filtros e carrinho. **Ponto de partida da oficina.** |
| `widget-agente` | A loja mais o widget flutuante de chat com o agente. **Resultado final.** |

O carrinho (`src/CartContext.jsx`) já expõe `addMany(produtos)`, que é o gancho para o agente colocar um carrinho sugerido inteiro de uma vez.

## Rodando localmente

Suba a **techstore-api** na porta 3001 e depois:

```bash
npm install
npm run dev          # http://localhost:5173
```

Em desenvolvimento não é preciso configurar nada: o Vite encaminha `/api` para `http://localhost:3001`.

## Variáveis de ambiente

| Variável | Obrigatória | Exemplo | Para que serve |
|---|---|---|---|
| `VITE_API_URL` | **sim, em produção** | `https://techstore-api.onrender.com` | URL pública da API, sem barra no final. |

> A `VITE_API_URL` é embutida no código **no momento do build**. Se mudar o valor no painel do deploy, faça um novo deploy.

## Deploy (Vercel, Netlify ou similar)

- **Framework:** Vite
- **Build:** `npm run build`
- **Pasta de saída:** `dist`
- **Variável:** `VITE_API_URL` com a URL da API

Depois do deploy, coloque a URL do front no `CORS_ORIGIN` da API.

## Estrutura

```
src/
  api.js                # monta as URLs a partir da VITE_API_URL
  App.jsx               # vitrine com filtros por categoria
  CartContext.jsx       # estado do carrinho (add, addMany, remove, clear)
  components/
    ProductCard.jsx
    CartDrawer.jsx
```
