import './env';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer } from 'ws';
import authRoutes from './routes/auth';
import { setupWebSocket } from './ws';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', authRoutes);

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

setupWebSocket(wss);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});