export const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8000';
export const USE_WEBSOCKET = import.meta.env.VITE_AI_USE_WEBSOCKET === 'true';

export function getWsUrl(path: string): string {
  // If running via Vite dev server proxy (or in a relative setup),
  // we could just use ws:// + window.location.host + /ai + path
  // Or we can parse the AI_SERVICE_URL and change it to ws://
  
  if (AI_SERVICE_URL.startsWith('http://localhost') && window.location.hostname === 'localhost') {
     // Local development, prefer the Vite proxy if possible, but for simplicity
     // let's just replace http with ws for the actual backend
     return AI_SERVICE_URL.replace(/^http/, 'ws') + path;
  }
  
  return AI_SERVICE_URL.replace(/^http/, 'ws') + path;
}
