// Renderizador mínimo de markdown: **negrito**, listas com "-" e quebras de linha.
// Gera elementos React, sem dangerouslySetInnerHTML.
function inline(texto) {
  return texto.split(/(\*\*[^*]+\*\*)/g).map((parte, i) =>
    parte.startsWith('**') && parte.endsWith('**')
      ? <strong key={i}>{parte.slice(2, -2)}</strong>
      : parte
  );
}

export default function RichText({ text = '' }) {
  const blocos = [];
  let lista = [];

  const fecharLista = () => {
    if (lista.length) blocos.push(<ul key={`ul-${blocos.length}`}>{lista}</ul>);
    lista = [];
  };

  text.split('\n').forEach((linha, i) => {
    const item = linha.match(/^\s*[-*•]\s+(.*)/);
    if (item) {
      lista.push(<li key={i}>{inline(item[1])}</li>);
      return;
    }
    fecharLista();
    if (linha.trim()) blocos.push(<p key={i}>{inline(linha.replace(/^#+\s*/, ''))}</p>);
  });
  fecharLista();

  return <>{blocos}</>;
}
