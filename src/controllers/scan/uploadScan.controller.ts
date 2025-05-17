import { Request, Response } from 'express';
import { prisma } from '../../utils/prisma';
import { uploadStreamToCloudinary } from '../../utils/cloudinary';

export const uploadScan = async (req: Request, res: Response) => {
  try {
    const { scanName, originX, originY, originZ, environmentId } = req.body;

    if (!scanName || !environmentId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const files = req.files as {
      file?: Express.Multer.File[];
      images?: Express.Multer.File[];
    };

    if (!files?.file?.[0]) {
      return res.status(400).json({ error: '3D model file is required' });
    }

    const fileUrl = await uploadStreamToCloudinary(
      files.file[0].buffer,
      'scans'
    );

    const imageUrls: string[] = [];
    if (files.images) {
      for (const img of files.images) {
        const imageUrl = await uploadStreamToCloudinary(
          img.buffer,
          'scan-images'
        );
        imageUrls.push(imageUrl);
      }
    }

    const scan = await prisma.scan.create({
      data: {
        scanName,
        fileUrl,
        images: imageUrls,
        position: [originX || 0, originY || 0, originZ || 0],
        rotations: [],
        scale: [],
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
