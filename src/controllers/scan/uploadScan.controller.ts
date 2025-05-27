import { Request, Response } from 'express';
import { prisma } from '../../utils/prisma';

interface S3MulterFile extends Express.Multer.File {
  location: string;
}

export const uploadScan = async (req: Request, res: Response) => {
  try {
    const { scanName, originX, originY, originZ, environmentId } = req.body;

    if (!scanName || !environmentId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const files = req.files as {
      file?: S3MulterFile[];
      images?: S3MulterFile[];
      material?: S3MulterFile[];
      textures?: S3MulterFile[];
    };

    const file = files?.file?.[0];
    if (!file?.location) {
      return res.status(400).json({ error: '3D model file is required' });
    }

    const material = files?.material?.[0];
    if (!material?.location) {
      return res.status(400).json({ error: 'Material file is required' });
    }

    const fileUrl = file.location;
    const materialUrl = material.location;

    const imageUrls: string[] = [];
    if (files.images?.length) {
      for (const img of files.images) {
        if (img.location) {
          imageUrls.push(img.location);
        }
      }
    }

    const textureUrls: string[] = [];
    if (files.textures?.length) {
      for (const tex of files.textures) {
        if (tex.location) {
          textureUrls.push(tex.location);
        }
      }
    }

    const scan = await prisma.scan.create({
      data: {
        scanName,
        fileUrl,
        material: materialUrl,
        images: imageUrls,
        textures: textureUrls,
        position: [
          parseFloat(originX) || 0,
          parseFloat(originY) || 0,
          parseFloat(originZ) || 0,
        ],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
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
