// src/controllers/auth/login.controller.ts
import { Request, Response } from 'express';
import { prisma } from '../../utils/prisma';
import { hashPassword, verifyPassword } from '../../services/auth.service';
import { generateToken } from '../../services/jwt.service';

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // 1) fetch the user + hash
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, password: true },
  });

  // 2) on any mismatch, respond 401 with { message }
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const valid = await verifyPassword(password, user.password!);
  if (!valid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // 3) success → issue token
  const token = generateToken(user.id);

  // 4) return exactly token + user
  return res.status(200).json({
    token,
    user: { id: user.id, email: user.email },
  });
};

export const createUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // check if the user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    return res.status(409).json({ error: 'user already exists' });
  }

  // validate the email and password
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  // hash the password before storing it
  const hashedPassword = await hashPassword(password);

  // create the user in the database
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  return res.status(201).json({ id: user.id, email: user.email });
};
