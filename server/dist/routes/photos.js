"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const s3_1 = require("../services/s3");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Get all photos
router.get('/', async (req, res, next) => {
    try {
        const photos = await prisma.photo.findMany({
            include: {
                user: true
            }
        });
        res.json(photos);
    }
    catch (error) {
        next(error);
    }
});
// Upload a new photo
router.post('/', auth_1.authenticate, async (req, res, next) => {
    console.log('uploading photo');
    try {
        if (!req.body.photo || !req.body.photo.startsWith('data:image')) {
            throw new errorHandler_1.AppError('No photo uploaded or invalid format', 400);
        }
        // Extract base64 data
        const base64Data = req.body.photo.split(';base64,').pop();
        if (!base64Data) {
            throw new errorHandler_1.AppError('Invalid image format', 400);
        }
        // Convert base64 to buffer
        const imageBuffer = Buffer.from(base64Data, 'base64');
        // Generate unique filename
        const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}.jpg`;
        // Upload to S3
        const imageUrl = await (0, s3_1.uploadToS3)(imageBuffer, filename);
        // Save to database
        const photo = await prisma.photo.create({
            data: {
                imageUrl,
                userId: req.user.userId
            }
        });
        res.status(201); //.json(photo);
    }
    catch (error) {
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
            throw new errorHandler_1.AppError('Photo not found', 404);
        }
        res.json(photo);
    }
    catch (error) {
        next(error);
    }
});
// Delete a photo
router.delete('/:id', auth_1.authenticate, async (req, res, next) => {
    try {
        const photo = await prisma.photo.findUnique({
            where: { id: parseInt(req.params.id) }
        });
        if (!photo) {
            throw new errorHandler_1.AppError('Photo not found', 404);
        }
        if (photo.userId !== req.user.userId) {
            throw new errorHandler_1.AppError('Not authorized', 403);
        }
        // Delete the file from S3
        try {
            await (0, s3_1.deleteFromS3)(photo.imageUrl);
        }
        catch (error) {
            console.error('Failed to delete from S3:', error);
            // Continue with database deletion even if S3 deletion fails
        }
        // Delete from database
        await prisma.photo.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
