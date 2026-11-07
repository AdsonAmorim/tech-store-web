// URL base da API. Em produção vem de VITE_API_URL (definida no build).
// Em desenvolvimento pode ficar vazia: o proxy do Vite encaminha /api para http://localhost:3001.
const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export const apiUrl = (path) => `${API_URL}${path}`;
