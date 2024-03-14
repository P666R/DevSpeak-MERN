import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import Post from '../models/post.model.js';

export const create = catchAsync(async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(
      new AppError('You are not authorized to perform this action', 403)
    );
  }

  if (!req.body.title || !req.body.content) {
    return next(new AppError('All fields are required', 400));
  }

  const slug = req.body.title
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '');

  const newPost = await Post.create({
    userId: req.user.id,
    title: req.body.title,
    content: req.body.content,
    slug,
    image: req.body.image,
    category: req.body.category,
  });

  res.status(201).json({
    status: 'success',
    data: {
      post: newPost,
    },
  });
});
