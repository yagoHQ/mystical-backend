import { Request, Response } from 'express';
import { prisma } from '../../utils/prisma';
import {  verifyPassword } from '../../services/auth.service';
import { generateToken } from '../../services/jwt.service';

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
  
    const user = await prisma.user.findUnique({ where: { email } });
    console.log('User:', user);
    if (!user || !user.password) return res.status(401).json({ error: 'Invalid credentials' });
  
    // const valid = await verifyPassword(password, user.password);
    // if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  
    const token = generateToken(user.id);
    res.status(200).json({ token, user: { id: user.id, email: user.email } });
  };
