"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
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
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET);
        res.status(201).json({ token });
    }
    catch (error) {
        next(error);
    }
});
router.post('/login', async (req, res, next) => {
    try {
        const { id } = req.body;
        if (!id) {
            throw new errorHandler_1.AppError('ID is required', 400);
        }
        const user = await prisma.user.findUnique({
            where: { id }
        });
        if (!user) {
            throw new errorHandler_1.AppError('Invalid credentials', 401);
        }
        /*
        const isValidPassword = await bcrypt.compare(password, user.secret);
        if (!isValidPassword) {
          throw new AppError('Invalid credentials', 401);
        }*/
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET);
        res.json({ token });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
