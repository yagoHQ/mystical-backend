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
