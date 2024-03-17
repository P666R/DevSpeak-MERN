import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';

export const test = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      message: 'Api is working !!!',
    },
  });
};

export const updateUser = catchAsync(async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(
      new AppError('You are not authorized to perform this action', 403)
    );
  }

  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(new AppError('Password must be at least 6 characters', 400));
    }
    req.body.password = await bcryptjs.hash(req.body.password, 12);
  }

  if (req.body.username) {
    if (req.body.username.length < 6 || req.body.username.length > 20) {
      return next(
        new AppError('Username must be between 6 and 20 characters', 400)
      );
    }
    if (req.body.username.includes(' ')) {
      return next(new AppError('Username cannot contain spaces', 400));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(new AppError('Username must be lowercase', 400));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        new AppError('Username must only contain letters and numbers', 400)
      );
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.userId,
    {
      $set: {
        username: req.body.username,
        email: req.body.email,
        profilePicture: req.body.profilePicture,
        password: req.body.password,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  updatedUser.password = undefined;

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

export const deleteUser = catchAsync(async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(
      new AppError('You are not authorized to perform this action', 403)
    );
  }

  await User.findByIdAndDelete(req.params.userId);

  res.status(200).json({
    status: 'success',
    data: {
      message: 'User deleted successfully',
    },
  });
});

export const signout = catchAsync(async (req, res, next) => {
  res
    .clearCookie('access_token')
    .status(200)
    .json({
      status: 'success',
      data: {
        message: 'User signed out successfully',
      },
    });
});

export const getUsers = catchAsync(async (req, res, next) => {
  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 9;
  const sortDirection = req.query.order === 'asc' ? 1 : -1;

  if (!req.user.isAdmin) {
    return next(
      new AppError('You are not authorized to perform this action', 403)
    );
  }

  const users = await User.find()
    .sort({ createdAt: sortDirection })
    .skip(startIndex)
    .limit(limit);

  const totalUsers = await User.countDocuments();

  const now = new Date();

  const oneMonthAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate()
  );

  const lastMonthUsers = await User.countDocuments({
    createdAt: { $gte: oneMonthAgo },
  });

  res.status(200).json({
    status: 'success',
    data: {
      users,
      totalUsers,
      lastMonthUsers,
    },
  });
});

export const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.userId);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
