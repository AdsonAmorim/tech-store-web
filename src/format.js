export const brl = (value) =>
  Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const CATEGORY_LABELS = {
  cpu: 'Processador',
  gpu: 'Placa de vídeo',
  motherboard: 'Placa-mãe',
  ram: 'Memória',
  storage: 'Armazenamento',
  psu: 'Fonte',
  case: 'Gabinete',
};

export const CATEGORY_ICONS = {
  cpu: '🧠', gpu: '🎮', motherboard: '🧩', ram: '⚡', storage: '💾', psu: '🔌', case: '🗄️',
};
