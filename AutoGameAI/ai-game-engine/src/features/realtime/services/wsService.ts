import { WebSocket } from 'ws';
import { CommandBridge } from '../../../services/bridge/CommandBridge';

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
  private commandBridge: CommandBridge;

  constructor() {
    this.commandBridge = new CommandBridge();
  }

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
        case 'babylon_create_entity':
        case 'babylon_remove_entity':
          this.commandBridge.handleCommand(parsed.type, parsed.payload);
          // Broadcast the action to other clients to keep them in sync
          this.broadcast(parsed, ws);
          break;
        case 'UNDO':
          this.commandBridge.handleUndo();
          // Broadcast generic undo event or state update
          this.broadcast({ type: 'UNDO_EXECUTED', payload: null }); 
          break;
        case 'REDO':
          this.commandBridge.handleRedo();
          // Broadcast generic redo event or state update
          this.broadcast({ type: 'REDO_EXECUTED', payload: null });
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
