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

export const getposts = catchAsync(async (req, res, next) => {
  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 9;
  const sortDirection = req.query.order === 'asc' ? 1 : -1;

  const posts = await Post.find({
    ...(req.query.userId && { userId: req.query.userId }),
    ...(req.query.category && { category: req.query.category }),
    ...(req.query.slug && { slug: req.query.slug }),
    ...(req.query.postId && { _id: req.query.postId }),
    ...(req.query.searchTerm && {
      $or: [
        { title: { $regex: req.query.searchTerm, $options: 'i' } },
        { content: { $regex: req.query.searchTerm, $options: 'i' } },
      ],
    }),
  })
    .sort({ updatedAt: sortDirection })
    .skip(startIndex)
    .limit(limit);

  const totalPosts = await Post.countDocuments();

  const now = new Date();

  const oneMonthAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate()
  );

  const lastMonthPosts = await Post.countDocuments({
    createdAt: { $gte: oneMonthAgo },
  });

  res.status(200).json({
    status: 'success',
    data: {
      posts,
      totalPosts,
      lastMonthPosts,
    },
  });
});
