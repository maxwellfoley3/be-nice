import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// Get comments for a photo
router.get('/photo/:photoId', async (req, res, next) => {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        photoId: parseInt(req.params.photoId)
      },
      include: {
        author: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get photos from comment authors
    const authorIds = [...new Set(comments.map(comment => comment.author.id))];
    const authorPhotos = await prisma.photo.findMany({
      where: {
        userId: {
          in: authorIds
        }
      },
      select: {
        imageUrl: true,
        userId: true
      }
    });

    // Add photos to response
    const commentsWithPhotos = comments.map(comment => ({
      ...comment,
      author: {
        ...comment.author,
        photos: authorPhotos.filter(photo => photo.userId === comment.author.id)
      }
    }));
    
    res.json(commentsWithPhotos);
  } catch (error) {
    next(error);
  }
});

// Create a comment
router.post('/', authenticate, async (req, res, next) => {
  console.log('Creating comment');
  try {
    const { content, photoId } = req.body;
    console.log('Content:', content);
    if (!content || !photoId) {
      throw new AppError('Content and photoId are required', 400);
    }

    const photo = await prisma.photo.findUnique({
      where: { id: parseInt(photoId) }
    });
    console.log('Photo:', photo);
    if (!photo) {
      throw new AppError('Photo not found', 404);
    }
    console.log('Photo found');
    const comment = await prisma.comment.create({
      data: {
        content,
        photoId: parseInt(photoId),
        authorId: req.user!.userId
      },
      include: {
        author: true
      }
    });

    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
});

// Delete a comment
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    if (comment.authorId !== req.user!.userId) {
      throw new AppError('Not authorized', 403);
    }

    await prisma.comment.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router; 