import { Request, Response } from 'express';
import { prisma } from '../../utils/prisma';

export const getEnvironmentMarkings = async (req: Request, res: Response) => {
  const { id: environmentId } = req.params;

  if (!environmentId) {
    return res.status(400).json({ error: 'Missing environmentId' });
  }

  try {
    const markings = await prisma.marking.findMany({
      where: {
        environmentId,
      },
      include: {
        createdBy: true,     
        comments: true, 
      },
    });

    res.json(markings);
  } catch (error) {
    console.error('[getEnvironmentMarkings]', error);
    res.status(500).json({ error: 'Failed to fetch markings' });
  }
};
