import { Request, Response } from 'express';
import { prisma } from '../../utils/prisma';
import { ObjectId } from 'mongodb';

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

    const orignPosition = await prisma.environment.findUnique({
      where: { id: environmentId },
      select: {
        originPosition: true,
      },
    });
    if (!orignPosition) {
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
    } else {
      const { originPosition } = orignPosition;

      const originX = originPosition[0];
      const originY = originPosition[1];
      const originZ = originPosition[2];
      const envX = parseFloat(x) - originX;
      const envY = parseFloat(y) - originY;
      const envZ = parseFloat(z) - originZ;

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
          envX,
          envY,
          envZ,
        },
      });

      return res.status(201).json(marking);
    }
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
    const marking = await prisma.marking.findUnique({
      where: {
        id,
      },
      include: {
        environment: {
          select: {
            title: true,
          },
        },
        createdBy: true,
        comments: {
          include: {
            user: true,
          },
        },
      },
    });

    res.json(marking);
  } catch (error) {
    console.error('[getEnvironmentMarkings]', error);
    res.status(500).json({ error: 'Failed to fetch markings' });
  }
};

export const getMarkingByEnvironmentId = async (
  req: Request,
  res: Response
) => {
  try {
    const { environmentId } = req.params;

    if (!environmentId) {
      return res
        .status(400)
        .json({ error: 'Missing environmentId in request params' });
    }

    const markings = await prisma.marking.findMany({
      where: { environmentId },
      orderBy: { createdAt: 'desc' },
      select: {
        envX: true,
        envY: true,
        envZ: true,
        id: true,
        remark: true,
        url: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json(markings);
  } catch (error) {
    console.error('[getMarkingByEnvironmentId]', error);
    res.status(500).json({ error: 'Failed to fetch markings' });
  }
};
