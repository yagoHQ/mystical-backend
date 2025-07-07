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

    const fileUrl = file.location;

    const material = files?.material?.[0];
    const materialUrl = material?.location || null;

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

    // 🧠 Get count of existing scans in the environment
    const scanCount = await prisma.scan.count({
      where: { environmentId },
    });

    // 💡 Calculate dynamic position based on count (x = count * 2, y = 0, z = count * 2)
    const dynamicPosition = [
      parseFloat(originX) || scanCount * 2,
      parseFloat(originY) || 0,
      parseFloat(originZ) || scanCount * 2,
    ];

    const scan = await prisma.scan.create({
      data: {
        scanName,
        fileUrl,
        material: materialUrl,
        images: imageUrls,
        textures: textureUrls,
        position: dynamicPosition,
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
