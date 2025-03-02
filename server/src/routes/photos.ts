import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { uploadToS3, deleteFromS3 } from '../services/s3';

const router = Router();
const prisma = new PrismaClient();

// Get all photos
router.get('/', async (req, res, next) => {
  try {
    const photos = await prisma.photo.findMany({
      include: {
        user: true
      }
    });
    res.json(photos);
  } catch (error) {
    next(error);
  }
});

// Get all photos for a user
router.get('/user/:clientId', async (req, res, next) => {
  try {
    const user = await prisma.user.findFirst({
      where: { clientId: req.params.clientId }
    });

    if (!user) {  
      throw new AppError('User not found', 404);
    }
    
    const photos = await prisma.photo.findMany({
      where: { userId: user.id }
    });
    res.json(photos);
  } catch (error) {
    next(error);
  }
});


// Upload a new photo
router.post('/', authenticate, async (req, res, next) => {
  console.log('Uploading photo');
  try {
    if (!req.body.photo || !req.body.photo.startsWith('data:image')) {
      throw new AppError('No photo uploaded or invalid format', 400);
    }

    // Extract base64 data
    const base64Data = req.body.photo.split(';base64,').pop();
    if (!base64Data) {
      throw new AppError('Invalid image format', 400);
    }

    // Convert base64 to buffer
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
    // Generate unique filename
    const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}.jpg`;
    
    // Upload to S3
    const imageUrl = await uploadToS3(imageBuffer, filename);

    // Save to database
    const photo = await prisma.photo.create({
      data: {
        imageUrl,
        userId: req.user!.userId
      }
    });

    res.status(201).json(photo);
  } catch (error) {
    next(error);
  }
});

// Get a specific photo
router.get('/:id', async (req, res, next) => {
  try {
    const photo = await prisma.photo.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        user: true
      }
    });

    if (!photo) {
      throw new AppError('Photo not found', 404);
    }

    res.json(photo);
  } catch (error) {
    next(error);
  }
});

// Delete a photo
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const photo = await prisma.photo.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!photo) {
      throw new AppError('Photo not found', 404);
    }

    if (photo.userId !== req.user!.userId) {
      throw new AppError('Not authorized', 403);
    }

    // Delete the file from S3
    try {
      await deleteFromS3(photo.imageUrl);
    } catch (error) {
      console.error('Failed to delete from S3:', error);
      // Continue with database deletion even if S3 deletion fails
    }

    // Delete from database
    await prisma.photo.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router; 