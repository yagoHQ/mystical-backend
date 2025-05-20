import { Request, Response } from 'express';
import { prisma } from '../../utils/prisma';

export const createMarking = async (req: Request, res: Response) => {
  try {
    const { x, y, z, environmentId, createdById, remark, metadata, url } =
      req.body;

    if (
      x === undefined ||
      y === undefined ||
      z === undefined ||
      !environmentId ||
      !createdById
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

export const deleteMarking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const marking = await prisma.marking.delete({
      where: { id },
    });

    return res.status(200).json(marking);
  } catch (error) {
    console.error('[deleteMarking]', error);
    return res.status(500).json({ error: 'Failed to delete marking' });
  }
};

export const getMarkingById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Missing markingId' });
  }

  try {
    const markings = await prisma.marking.findMany({
      where: {
        id,
      },
      include: {
        createdBy: true,
        comments: {
          include: {
            user: true,
          },
        },
      },
    });

    res.json(markings);
  } catch (error) {
    console.error('[getEnvironmentMarkings]', error);
    res.status(500).json({ error: 'Failed to fetch markings' });
  }
};
