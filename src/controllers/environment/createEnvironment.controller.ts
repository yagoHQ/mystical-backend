import { Request, Response } from 'express';
import { prisma } from '../../utils/prisma';
import { uploadStreamToCloudinary } from '../../utils/cloudinary';

export const createEnvironment = async (req: Request, res: Response) => {
  try {
    const { title, location, scannedById } = req.body;

    if (!title || !scannedById) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    let imageUrl = '';

    if (req.file) {
      const buffer = req.file.buffer;
      imageUrl = await uploadStreamToCloudinary(buffer, 'environments');
    }

    const environment = await prisma.environment.create({
      data: {
        title,
        location,
        image: imageUrl,
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

export const bulkUpdateScans = async (req: Request, res: Response) => {
  try {
    const { scans } = req.body;

    if (!Array.isArray(scans) || scans.length === 0) {
      return res.status(400).json({ error: 'Scans array is required' });
    }

    const updateResults = await Promise.allSettled(
      scans.map((scan) => {
        const { id, position, rotation, scale } = scan;
        return prisma.scan.update({
          where: { id },
          data: { position, rotation, scale },
        });
      })
    );

    const successful = updateResults
      .filter((r) => r.status === 'fulfilled')
      .map((r) => (r as PromiseFulfilledResult<any>).value);
    const failed = updateResults.filter((r) => r.status === 'rejected');

    return res.status(200).json({
      message: 'Bulk scan update completed',
      updated: successful.length,
      failed: failed.length,
      scans: successful,
    });
  } catch (error) {
    console.error('[bulkUpdateScans]', error);
    return res.status(500).json({ error: 'Failed to update scans' });
  }
};
