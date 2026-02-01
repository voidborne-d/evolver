import { WebSocketServer } from 'ws';
import { WsService } from './features/realtime/services/wsService';

const port = 7314;
const wss = new WebSocketServer({ port });
const wsService = new WsService();

wss.on('connection', (ws) => {
  console.log('Client connected');
  wsService.addClient(ws);
});

console.log(`WebSocket server started on port ${port}`);
