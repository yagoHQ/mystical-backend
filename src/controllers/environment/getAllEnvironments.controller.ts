import { Request, Response } from 'express';
import { prisma } from '../../utils/prisma';

export const getAllEnvironments = async (_req: Request, res: Response) => {
  try {
    const environments = await prisma.environment.findMany({
      include: {
        scans: true,
        scannedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json(environments);
  } catch (error) {
    console.error('[getAllEnvironments]', error);
    res.status(500).json({ error: 'Failed to fetch environments' });
  }
};
