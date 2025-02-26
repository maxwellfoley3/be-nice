import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

router.post('/register', async (req, res, next) => {
  try {
    const { id } = req.body;


    /*
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new AppError('User already exists', 400);
    }*/

    const user = await prisma.user.create({
      data: {
        clientId: id
      }
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { id } = req.body;

    if (!id) {
      throw new AppError('ID is required', 400);
    }

    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    /*
    const isValidPassword = await bcrypt.compare(password, user.secret);
    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401);
    }*/

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({ token });
  } catch (error) {
    next(error);
  }
});

export default router; 