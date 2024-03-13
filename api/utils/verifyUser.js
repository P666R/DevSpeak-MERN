import jwt from 'jsonwebtoken';
import AppError from './appError.js';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return next(new AppError('Unauthorized', 401));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(new AppError('Unauthorized', 401));
    }

    req.user = user;
    next();
  });
};
