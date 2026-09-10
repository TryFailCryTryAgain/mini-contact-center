# Mini Contact Center

A lightweight real-time chat application demonstrating secure WebSocket
communication, built with Vue 3 + TypeScript on the frontend and a
Node.js + TypeScript backend. Designed as an exploration of the kind of
real-time, security-conscious web infrastructure used in contact center
platforms.

## Features

- **Real-time messaging** over WebSockets, with a shared chat room and live presence (who's online)
- **JWT-based authentication** — register, log in, and connect to the WebSocket with a signed token
- **Hashed passwords** via bcrypt — plaintext passwords are never stored
- **Message history** sent to newly joined clients, so conversations have context on arrival
- **Fully Dockerized** — one command spins up both frontend and backend
- **Typed throughout** — TypeScript on both frontend and backend

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Vue 3, TypeScript, Vite, Pinia, Vue Router |
| Backend | Node.js, Express, TypeScript, `ws` |
| Auth | JWT (`jsonwebtoken`), `bcrypt` |
| Tooling | ESLint, Oxlint, Prettier |
| Infra | Docker, Docker Compose |

## Getting started

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- Node.js 22+ (only needed if you want to run things outside Docker)

### Run with Docker (recommended)

```bash
git clone <this-repo-url>
cd mini-contact-center
docker compose up --build
```

Then open:

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:3000](http://localhost:3000)

### Try it out

1. Open [http://localhost:5173](http://localhost:5173) in one browser tab and register a user.
2. Open the same URL in a second tab (or an incognito window) and register a different user.
3. Send messages between the two — they'll arrive in real time over the WebSocket connection, and the sidebar will show both users as online.

### Run without Docker

```bash
# Backend
cd backend
npm install --legacy-peer-deps
cp .env.example .env   # then fill in a real JWT_SECRET, see below
npm run dev

# Frontend (in a separate terminal)
cd frontend
npm install --legacy-peer-deps
npm run dev
```

Generate a `JWT_SECRET` value with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Architecture

```
mini-contact-center/
├── docker-compose.yml
├── backend/
│   ├── src/
│   │   ├── index.ts          # Express + WebSocket server entry point
│   │   ├── env.ts            # loads .env before anything else
│   │   ├── models/           # User type definitions
│   │   ├── store/            # in-memory user storage
│   │   ├── auth/             # JWT signing/verification, password hashing
│   │   ├── controllers/      # request handlers for /login, /register
│   │   ├── routes/           # Express route definitions
│   │   └── ws/               # WebSocket connection handling, presence, history
│   └── Dockerfile
└── frontend/
    ├── src/
    │   ├── stores/            # Pinia stores: auth, chat
    │   ├── views/             # SignInView, RegisterView, ChatView
    │   ├── components/        # ChatSidebar, MessageThread, MessageComposer
    │   └── router/            # route definitions + auth guard
    └── Dockerfile
```

Express and the WebSocket server share a single underlying HTTP server —
`ws` upgrades connections on the same port Express listens on, so there's
only one process and one port to manage per service.

### Message flow

1. User registers or logs in via a REST call (`POST /register` or `POST /login`), receiving a JWT.
2. On navigating to the chat view, the frontend opens a WebSocket connection and sends the JWT as the first message (`{ type: 'auth', token }`).
3. The backend verifies the token, registers the client, sends them recent message history, and broadcasts updated presence to everyone.
4. Messages sent afterward (`{ type: 'message', text }`) are broadcast to all connected clients.
5. On disconnect, the client is removed and presence is broadcast again.

## Security decisions

A few choices made deliberately with security in mind, worth calling out:

- **Passwords are hashed with bcrypt**, never stored or transmitted in plaintext.
- **JWTs are kept in memory (Pinia state), not `localStorage`** — this avoids exposing the token to a potential XSS attack that could read `localStorage` directly. The tradeoff is that a page refresh currently requires logging in again; a production version would pair a short-lived in-memory access token with an HTTP-only refresh cookie.
- **The WebSocket connection requires authentication** — a socket is not admitted to the room, and cannot send or receive messages, until it presents a valid JWT.
- **The `User` model excludes `passwordHash` from anything sent to the client**, enforced structurally via a `PublicUser` type and mapping function, rather than relying on remembering to omit it manually in every response.

## Scope and next steps

This project intentionally keeps a few things simple, with clear seams for extending them:

- **In-memory storage.** Users, sessions, and message history live in memory and reset when the server restarts. Every place a real database would plug in is marked with a `DEPLOYMENT NOTE` comment in the code (see `backend/src/store/userStore.ts`).
- **One shared chat room.** All connected users see the same conversation, rather than private 1-on-1 or group rooms. The room/broadcast architecture extends naturally to per-pair or per-group rooms keyed by a room ID.
- **No message persistence beyond the last 50 messages**, kept in a capped in-memory array.

## Font and styling note

The UI is styled with a nod to Telia's visual identity — clean sans-serif
typography and a purple accent palette — using the open-license **Inter**
font rather than Telia's proprietary TeliaSans typeface, for licensing
reasons.

## License

MIT — see [LICENSE](./LICENSE).