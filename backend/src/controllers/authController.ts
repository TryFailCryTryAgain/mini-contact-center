import type { Request, Response } from 'express';
import { createUser, findUserByUsername, usernameExists } from '../store/userStore';
import { hashPassword, verifyPassword } from '../auth/password';
import { signToken } from '../auth/jwt';
import { toPublicUser } from '../models/user';

export async function register(req: Request, res: Response) {
  const { username, password } = req.body;

  if (typeof username !== 'string' || username.trim().length < 3) {
    return res.status(400).json({ message: 'Username must be at least 3 characters.' });
  }
  if (typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters.' });
  }
  if (usernameExists(username)) {
    return res.status(409).json({ message: 'That username is already taken.' });
  }

  const passwordHash = await hashPassword(password);
  const user = createUser(username, passwordHash);
  const token = signToken({ userId: user.id, username: user.username });

  res.status(201).json({ user: toPublicUser(user), token });
}

export async function login(req: Request, res: Response) {
  const { username, password } = req.body;

  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  const user = findUserByUsername(username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password.' });
  }

  const validPassword = await verifyPassword(password, user.passwordHash);
  if (!validPassword) {
    return res.status(401).json({ message: 'Invalid username or password.' });
  }

  const token = signToken({ userId: user.id, username: user.username });
  res.status(200).json({ user: toPublicUser(user), token });
}