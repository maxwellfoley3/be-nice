import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import photoRoutes from './routes/photos';
import commentRoutes from './routes/comments';
import { errorHandler } from './middleware/errorHandler';
import morgan from 'morgan';
import path from 'path';
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(morgan('combined'))

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/comments', commentRoutes);

// Serve static files from client/dist
app.use(express.static(path.join(__dirname, '../../client/dist/be-nice-client/browser')))

/* final catch-all route to index.html defined last */
app.get('*', (req, res) => {
  console.log('CATCH ALL')
  res.sendFile(path.join(__dirname, '../../client/dist/be-nice-client/browser/index.html'));
})

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 