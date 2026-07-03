import { AI_SERVICE_URL, getWsUrl, USE_WEBSOCKET } from '../config/ai';

export interface AIEvent {
  type: string;
  [key: string]: any;
}

export class AIProctorService {
  private ws: WebSocket | null = null;
  private sessionId: string | null = null;
  private onEventsCallback: ((events: AIEvent[]) => void) | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private isStopping = false;

  public async startSession(): Promise<string | null> {
    try {
      const res = await fetch(`${AI_SERVICE_URL}/session/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        const data = await res.json();
        this.sessionId = data.session_id;
        return this.sessionId;
      }
    } catch (e) {
      console.error('Failed to start AI session', e);
    }
    return null;
  }

  public connect(sessionId: string) {
    if (!USE_WEBSOCKET) return; // Fallback to REST handled by component if needed

    this.sessionId = sessionId;
    this.isStopping = false;
    const wsUrl = getWsUrl(`/ws/session/${sessionId}`);
    
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('AI WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'events' && data.events && data.events.length > 0) {
          if (this.onEventsCallback) {
            this.onEventsCallback(data.events);
          }
        }
      } catch (e) {
        console.error('Error parsing WS message', e);
      }
    };

    this.ws.onclose = () => {
      console.log('AI WebSocket disconnected');
      if (!this.isStopping && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        setTimeout(() => {
          console.log(`Reconnecting AI WebSocket (Attempt ${this.reconnectAttempts})...`);
          this.connect(sessionId);
        }, 2000 * Math.pow(2, this.reconnectAttempts - 1));
      }
    };

    this.ws.onerror = (error) => {
      console.error('AI WebSocket error:', error);
    };
  }

  public sendFrame(base64Image: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'frame',
        image_b64: base64Image
      }));
    }
  }

  public onEvents(callback: (events: AIEvent[]) => void) {
    this.onEventsCallback = callback;
  }

  public async stop() {
    this.isStopping = true;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    try {
      await fetch(`${AI_SERVICE_URL}/session/stop`, { method: 'POST' });
    } catch (e) {
      console.error('Failed to stop AI session', e);
    }
  }

  // REST Fallback inference
  public async inferREST(base64Image: string): Promise<AIEvent[]> {
    try {
      const res = await fetch(`${AI_SERVICE_URL}/infer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_b64: base64Image })
      });
      if (res.ok) {
        const data = await res.json();
        return data.events || [];
      }
    } catch (e) {
      console.error('REST inference failed', e);
    }
    return [];
  }
}

export const aiProctorService = new AIProctorService();
