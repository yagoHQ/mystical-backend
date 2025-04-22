import { Request, Response } from 'express';
import { prisma } from '../../utils/prisma';
import { uploadStreamToCloudinary } from '../../utils/cloudinary';

export const uploadScan = async (req: Request, res: Response) => {
  try {
    const { scanName, originX, originY, originZ, environmentId } = req.body;

    if (!req.file || !environmentId || !scanName) {
      return res.status(400).json({ error: 'Missing required fields or file' });
    }

    const fileUrl = await uploadStreamToCloudinary(req.file.buffer, 'scans');

    const scan = await prisma.scan.create({
      data: {
        scanName,
        fileUrl,
        originX: parseFloat(originX),
        originY: parseFloat(originY),
        originZ: parseFloat(originZ),
        environment: {
          connect: { id: environmentId },
        },
      },
    });

    return res.status(201).json(scan);
  } catch (error) {
    console.error('[uploadScan]', error);
    return res.status(500).json({ error: 'Failed to upload scan' });
  }
};
