import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

export const signup = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === '' ||
    email === '' ||
    password === ''
  ) {
    return next(new AppError('All fields are required', 400));
  }

  const hashedPassword = await bcryptjs.hash(password, 12);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    status: 'Success',
    data: {
      user: newUser,
    },
  });
});
