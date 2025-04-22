import { Request, Response } from 'express';
import { prisma } from '../../utils/prisma';

export const getEnvironmentById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Environment ID is required' });
  }

  try {
    const environment = await prisma.environment.findUnique({
      where: { id },
      include: {
        scannedBy: true,
        scans: true,
        markings: {
          include: {
            createdBy: true,
            comments: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    if (!environment) {
      return res.status(404).json({ error: 'Environment not found' });
    }

    return res.json(environment);
  } catch (error) {
    console.error('[getEnvironmentById]', error);
    return res.status(500).json({ error: 'Failed to fetch environment details' });
  }
};
