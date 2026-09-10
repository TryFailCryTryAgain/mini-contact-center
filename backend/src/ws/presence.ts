import type { WebSocket } from 'ws';

export interface ConnectedClient {
  userId: string;
  username: string;
  socket: WebSocket;
}

export interface ChatMessage {
  username: string;
  text: string;
  timestamp: number;
}

const MAX_HISTORY = 50;
const messageHistory: ChatMessage[] = [];

export function addToHistory(message: ChatMessage) {
  messageHistory.push(message);
  if (messageHistory.length > MAX_HISTORY) {
    messageHistory.shift();
  }
}

export function getHistory(): ChatMessage[] {
  return messageHistory;
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