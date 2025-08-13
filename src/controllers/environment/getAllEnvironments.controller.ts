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
    return res
      .status(500)
      .json({ error: 'Failed to fetch environment details' });
  }
};

export const getDashboardData = async (_req: Request, res: Response) => {
  try {
    const [
      areaScanned,
      totalUsers,
      totalMarkings,
      totalSuggestions,
      recentAreas,
      recentSuggestions,
      recentMarkingsRaw,
    ] = await Promise.all([
      prisma.environment.count(),
      prisma.user.count(),
      prisma.marking.count(),
      prisma.comment.count(),
      prisma.environment.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, title: true, location: true, createdAt: true },
      }),
      prisma.comment.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, markingId: true, createdAt: true },
      }),
      prisma.marking.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          createdAt: true,
          remark: true,
          environmentId: true,
        },
      }),
    ]);

    const recentMarkings = await Promise.all(
      recentMarkingsRaw.map(async (marking) => {
        const env = await prisma.environment.findUnique({
          where: { id: marking.environmentId },
          select: { title: true },
        });

        return {
          ...marking,
          environmentTitle: env?.title ?? 'Unknown',
        };
      })
    );

    res.status(200).json({
      areaScanned,
      totalUsers,
      totalMarkings,
      totalSuggestions,
      recentAreas,
      recentSuggestions,
      recentMarkings,
    });
  } catch (error) {
    console.error('[getDashboardData]', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

export const addOrigin = async (_req: Request, res: Response) => {
  try {
    const {
      environmentId,
      positionX,
      positionY,
      positionZ,
      rotationX,
      rotationY,
      rotationZ,
    } = _req.body;

    if (
      !environmentId ||
      positionX === undefined ||
      positionY === undefined ||
      positionZ === undefined
    ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const h = parseFloat(positionX);
    const k = parseFloat(positionY);
    const t = parseFloat(positionZ);

    const rx = parseFloat(rotationX ?? 0);
    const ry = parseFloat(rotationY ?? 0);
    const rz = parseFloat(rotationZ ?? 0);

    await prisma.environment.update({
      where: { id: environmentId },
      data: {
        originPosition: [h, k, t],
        originRotation: [rx, ry, rz],
      },
    });

    const markings = await prisma.marking.findMany({
      where: { environmentId },
    });

    const updatePromises = markings.map((mark) => {
      const envX = mark.x - h;
      const envY = mark.y - k;
      const envZ = mark.z - t;

      return prisma.marking.update({
        where: { id: mark.id },
        data: {
          envX,
          envY,
          envZ,
        },
      });
    });

    await Promise.all(updatePromises);

    res.status(200).json({
      message: 'Origin shifted and markings updated successfully.',
    });
  } catch (error) {
    console.error('[shiftOriginAndUpdateMarkings]', error);
    res
      .status(500)
      .json({ error: 'Failed to shift origin or update markings' });
  }
};

export const updateMarkingLocation = async (req: Request, res: Response) => {
  try {
    const { markingId, environmentId, envX, envY, envZ } = req.body;

    if (
      !markingId ||
      !environmentId ||
      envX === undefined ||
      envY === undefined ||
      envZ === undefined
    ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const relativeX = parseFloat(envX);
    const relativeY = parseFloat(envY);
    const relativeZ = parseFloat(envZ);

    const environment = await prisma.environment.findUnique({
      where: { id: environmentId },
    });

    if (!environment || !environment.originPosition) {
      return res
        .status(404)
        .json({ error: 'Origin not set for this environment' });
    }

    const [originX, originY, originZ] = environment.originPosition;

    // Convert from relative (envX/Y/Z) to absolute (x/y/z)
    const x = originX + relativeX;
    const y = originY + relativeY;
    const z = originZ + relativeZ;

    const updatedMarking = await prisma.marking.update({
      where: { id: markingId },
      data: {
        x,
        y,
        z,
        envX: relativeX,
        envY: relativeY,
        envZ: relativeZ,
      },
    });

    res.status(200).json(updatedMarking);
  } catch (error) {
    console.error('[updateMarkingLocation]', error);
    res.status(500).json({ error: 'Failed to update marking location' });
  }
};
