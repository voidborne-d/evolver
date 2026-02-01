import { WebSocket } from 'ws';

interface CursorMovePayload {
  x: number;
  y: number;
  userId: string;
}

interface Message {
  type: string;
  payload: any;
}

export class WsService {
  private clients: Set<WebSocket> = new Set();

  constructor() {}

  public addClient(ws: WebSocket) {
    this.clients.add(ws);
    ws.on('message', (message: string) => this.handleMessage(ws, message));
    ws.on('close', () => this.clients.delete(ws));
  }

  private handleMessage(ws: WebSocket, message: any) {
    try {
      const parsed: Message = JSON.parse(message.toString());
      
      switch (parsed.type) {
        case 'CURSOR_MOVE':
          this.handleCursorMove(ws, parsed.payload);
          break;
        default:
          console.warn('Unknown message type:', parsed.type);
      }
    } catch (error) {
      console.error('Failed to parse message:', error);
    }
  }

  private handleCursorMove(senderWs: WebSocket, payload: CursorMovePayload) {
    // Action: Broadcast to all OTHER clients (exclude sender).
    this.broadcast({ type: 'CURSOR_MOVE', payload }, senderWs);
  }

  private broadcast(data: any, excludeWs?: WebSocket) {
    const message = JSON.stringify(data);
    for (const client of this.clients) {
      if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  }
}
