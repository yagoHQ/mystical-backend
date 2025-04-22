import { Request, Response } from 'express';
import { prisma } from '../../utils/prisma';

export const updateMarking = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { x, y, z, remark, url, metadata } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Missing marking ID in URL' });
  }

  try {
    const existing = await prisma.marking.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Marking not found' });
    }

    const updated = await prisma.marking.update({
      where: { id },
      data: {
        ...(x !== undefined && { x: parseFloat(x) }),
        ...(y !== undefined && { y: parseFloat(y) }),
        ...(z !== undefined && { z: parseFloat(z) }),
        ...(remark !== undefined && { remark }),
        ...(url !== undefined && { url }),
        ...(metadata !== undefined && { metadata }),
      },
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error('[updateMarking]', error);
    return res.status(500).json({ error: 'Failed to update marking' });
  }
};
