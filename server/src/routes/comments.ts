import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { analyzeSentiment } from '../services/sentiment';
import { getCurrentPhotoForUser } from '../services/getCurrentPhotoForUser';
const router = Router();
const prisma = new PrismaClient();

// Get comments for a photo
router.get('/photo/:photoId', async (req, res, next) => {
  try {
    console.log('Getting comments for photooooo', req.params.photoId);
    const comments = await prisma.comment.findMany({
      where: {
        photoId: parseInt(req.params.photoId)
      },
      include: {
        author: true,
        photo: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    console.log('Found', comments.length, 'comments');

    // get the current photo for each user
    const currentPhotos = await Promise.all(comments.map(async (comment) => {
      return await getCurrentPhotoForUser(comment.authorId);
    }));

    // add the current photo to the comments
    const commentsWithPhotos = comments.map((comment, index) => {
      return {
        ...comment,
        authorPhoto: currentPhotos[index]?.imageUrl
      };
    });

    res.json(commentsWithPhotos);
  } catch (error) {
    next(error);
  }
});

// Create a comment
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { content, photoId } = req.body;
    if (!content || !photoId) {
      throw new AppError('Content and photoId are required', 400);
    }

    // Analyze sentiment of the comment
    const sentiment = (await analyzeSentiment(content))[0];

    if (sentiment.label === 'NEGATIVE') {
      throw new AppError('Comment is negative', 400);
    }

    const photo = await prisma.photo.findUnique({
      where: { id: parseInt(photoId) }
    });

    if (!photo) {
      throw new AppError('Photo not found', 404);
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        photoId: parseInt(photoId),
        authorId: req.user!.userId,
        sentimentLabel: sentiment.label,
        sentimentScore: sentiment.score
      },
      include: {
        author: true,
        photo: true
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