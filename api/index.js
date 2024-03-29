import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';
import http from 'http';
import path from 'path';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';
import globalErrorHandler from './controllers/error.controller.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const __dirname = path.resolve();

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 4000;

const DB = process.env.MONGODB_URL;

const server = http.createServer(app);

const startServer = async () => {
  try {
    await mongoose.connect(DB);
    console.log('Database successfully connected...');

    server.listen(port, () => {
      console.log(`Server running on port: ${port}...`);
    });
  } catch (err) {
    console.log(err.name, err.message);
  }
};

startServer();

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/comment', commentRoutes);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.use(globalErrorHandler);
