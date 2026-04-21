import { getToken } from '@/lib/token';
import type { WsEvent } from '@/types/api';

const WS_URL = 'wss://k8s.mectest.ru/test-app/ws';
const RECONNECT_DELAY_MS = 3000;
const MAX_RECONNECT_DELAY_MS = 30_000;

type Listener = (event: WsEvent) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private listeners = new Set<Listener>();
  private delay = RECONNECT_DELAY_MS;
  private destroyed = false;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;
    if (this.destroyed) return;

    const token = getToken();
    const url = `${WS_URL}?token=${token}`;

    try {
      this.ws = new WebSocket(url);
    } catch {
      this.scheduleReconnect();
      return;
    }

    this.ws.onopen = () => {
      this.delay = RECONNECT_DELAY_MS; // reset backoff on success
    };

    this.ws.onmessage = (ev) => {
      try {
        const event: WsEvent = JSON.parse(ev.data as string);
        this.listeners.forEach((l) => l(event));
      } catch {
        // ignore unparseable frames
      }
    };

    this.ws.onerror = () => {
      // onclose will fire next and trigger reconnect
    };

    this.ws.onclose = () => {
      if (!this.destroyed) this.scheduleReconnect();
    };
  }

  private scheduleReconnect() {
    if (this.destroyed) return;
    this.reconnectTimer = setTimeout(() => {
      this.delay = Math.min(this.delay * 2, MAX_RECONNECT_DELAY_MS);
      this.connect();
    }, this.delay);
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  destroy() {
    this.destroyed = true;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
    this.ws = null;
    this.listeners.clear();
  }
}

// Singleton
export const wsService = new WebSocketService();
