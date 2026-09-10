import type { WebSocket } from 'ws';

export interface ConnectedClient {
  userId: string;
  username: string;
  socket: WebSocket;
}

const clients = new Map<WebSocket, ConnectedClient>();

export function addClient(client: ConnectedClient) {
  clients.set(client.socket, client);
}

export function removeClient(socket: WebSocket) {
  clients.delete(socket);
}

export function getClient(socket: WebSocket): ConnectedClient | undefined {
  return clients.get(socket);
}

export function getAllClients(): ConnectedClient[] {
  return [...clients.values()];
}

export function getOnlineUsernames(): string[] {
  return getAllClients().map((c) => c.username);
}