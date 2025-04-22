import { Request, Response } from 'express';
import {prisma} from '../../utils/prisma';

export const  createEnvironment = async (req: Request, res: Response) => {
  try {
    const { title, description, location, scannedById } = req.body;

    if (!title  || !scannedById) {
       res.status(400).json({ error: 'Missing required fields' });
       return;
    }

    const environment = await prisma.environment.create({
      data: {
        title,
        description,
        location,
        scannedBy: { connect: { id: scannedById } },
      },
    });

     res.status(201).json(environment);
     return;
  } catch (error) {
    console.error('[createScanEnv]', error);
     res.status(500).json({ error: 'Failed to create scan environment' });
     return;
  }
};



