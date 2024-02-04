import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
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

  //! hash password
  const hashedPassword = await bcryptjs.hash(password, 12);

  //! create user in db
  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

export const signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === '' || password === '') {
    return next(new AppError('All fields are required', 400));
  }

  //! find user in db
  const validUser = await User.findOne({ email }).select('+password');

  if (!validUser) {
    return next(new AppError('User not found', 404));
  }

  //! validate password
  const isValidPassword = await bcryptjs.compare(password, validUser.password);

  if (!isValidPassword) {
    return next(new AppError('Invalid credentials', 401));
  }

  //! generate JWT
  const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

  const cookieOptions = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  //! send cookie only over https in production
  if (process.env.NODE_ENV === 'production') {
    if (req.secure || req.get('x-forwarded-proto') === 'https') {
      cookieOptions.secure = true;
    }
  }

  //! remove password from response
  validUser.password = undefined;

  res
    .status(200)
    .cookie('access_token', token, cookieOptions)
    .json({
      status: 'success',
      data: {
        user: validUser,
      },
    });
});
