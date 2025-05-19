import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const createComment = async (req: Request, res: Response) => {
  try {
    const { comment, userId, markingId } = req.body;
    const commentCreated = await prisma.comment.create({
      data: { comment, userId, markingId },
    });
    res.status(201).json(commentCreated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create comment', details: err });
  }
};

export const getCommentsByMarkingId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const comments = await prisma.comment.findMany({
      where: { markingId: id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments', details: err });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.comment.delete({ where: { id } });
    res.status(200).json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete comment', details: err });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { comment },
    });
    res.json(updatedComment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update comment', details: err });
  }
};
