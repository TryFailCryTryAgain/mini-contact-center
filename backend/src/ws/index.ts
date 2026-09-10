import type { WebSocketServer, WebSocket } from 'ws';
import { verifyToken } from '../auth/jwt';
import { addClient, removeClient, getAllClients, getOnlineUsernames } from './presence';

interface IncomingMessage {
  type: 'auth' | 'message';
  token?: string;
  text?: string;
}

export function setupWebSocket(wss: WebSocketServer) {
  wss.on('connection', (socket: WebSocket) => {
    console.log('New client connected');

    socket.on('message', (raw) => {
      let data: IncomingMessage;
      try {
        data = JSON.parse(raw.toString());
      } catch {
        socket.send(JSON.stringify({ type: 'error', message: 'Invalid message format.' }));
        return;
      }

      // First message from the client must authenticate the connection
      if (data.type === 'auth') {
        if (!data.token) {
          socket.send(JSON.stringify({ type: 'error', message: 'Missing token.' }));
          socket.close();
          return;
        }
        try {
          const payload = verifyToken(data.token);
          addClient({ userId: payload.userId, username: payload.username, socket });
          broadcastPresence();
        } catch {
          socket.send(JSON.stringify({ type: 'error', message: 'Invalid or expired token.' }));
          socket.close();
        }
        return;
      }

      // Regular chat message — must already be authenticated
      if (data.type === 'message') {
        const client = getAllClients().find((c) => c.socket === socket);
        if (!client) {
          socket.send(JSON.stringify({ type: 'error', message: 'Not authenticated.' }));
          return;
        }
        broadcast({
          type: 'message',
          username: client.username,
          text: data.text,
          timestamp: Date.now(),
        });
      }
    });

    socket.on('close', () => {
      console.log('Client disconnected');
      removeClient(socket);
      broadcastPresence();
    });
  });
}

function broadcast(payload: object) {
  const message = JSON.stringify(payload);
  for (const client of getAllClients()) {
    client.socket.send(message);
  }
}

function broadcastPresence() {
  broadcast({ type: 'presence', users: getOnlineUsernames() });
}