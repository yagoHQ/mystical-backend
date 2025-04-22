import { Request, Response } from 'express';
import { prisma } from '../../utils/prisma';

export const createMarking = async (req: Request, res: Response) => {
  try {
    const {
      x,
      y,
      z,
      environmentId,
      createdById,
      remark,
      metadata,
      url,
    } = req.body;

    if (
      x === undefined || y === undefined || z === undefined ||
      !environmentId || !createdById
    ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const marking = await prisma.marking.create({
      data: {
        x: parseFloat(x),
        y: parseFloat(y),
        z: parseFloat(z),
        environment: { connect: { id: environmentId } },
        createdBy: { connect: { id: createdById } },
        remark,
        metadata,
        url,
      },
    });

    return res.status(201).json(marking);
  } catch (error) {
    console.error('[createMarking]', error);
    return res.status(500).json({ error: 'Failed to add marking' });
  }
};
