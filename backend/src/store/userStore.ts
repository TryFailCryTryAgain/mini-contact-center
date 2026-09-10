import { randomUUID } from 'crypto';
import type { User } from '../models/user';

/*
  === DEPLOYMENT NOTE ===
  This in-memory Map stands in for a real database.
  If deployed, replace with e.g. Prisma + PostgreSQL:
    const user = await prisma.user.findUnique({ where: { username } });
  Connection setup would live in src/db/connection.ts, configured via
  a DATABASE_URL environment variable.
*/
const users = new Map<string, User>(); // keyed by username

export function createUser(username: string, passwordHash: string): User {
  const user: User = {
    id: randomUUID(),
    username,
    passwordHash,
    createdAt: new Date(),
  };
  users.set(username, user);
  return user;
}

export function findUserByUsername(username: string): User | undefined {
  return users.get(username);
}

export function usernameExists(username: string): boolean {
  return users.has(username);
}