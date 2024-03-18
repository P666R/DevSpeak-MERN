import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Comment from '../models/comment.model.js';

export const createComment = catchAsync(async (req, res, next) => {
  const { postId, content, userId } = req.body;

  if (userId !== req.user.id) {
    return next(
      new AppError('You are not authorized to perform this action', 403)
    );
  }

  const newComment = await Comment.create({
    userId,
    postId,
    content,
  });

  res.status(200).json({
    status: 'success',
    data: {
      comment: newComment,
    },
  });
});

export const getPostComments = catchAsync(async (req, res, next) => {
  const comments = await Comment.find({ postId: req.params.postId }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    status: 'success',
    data: {
      comments,
    },
  });
});

export const likeComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    return next(new AppError('Comment not found', 404));
  }

  const userIndex = comment.likes.indexOf(req.user.id);

  if (userIndex === -1) {
    comment.likes.push(req.user.id);
    comment.numberOfLikes += 1;
  } else {
    comment.likes.splice(userIndex, 1);
    comment.numberOfLikes -= 1;
  }

  await comment.save();

  res.status(200).json({
    status: 'success',
    data: {
      comment,
    },
  });
});

export const editComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    return next(new AppError('Comment not found', 404));
  }

  if (comment.userId !== req.user.id && !req.user.isAdmin) {
    return next(
      new AppError('You are not authorized to perform this action', 403)
    );
  }

  const editedComment = await Comment.findByIdAndUpdate(
    req.params.commentId,
    {
      content: req.body.content,
    },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      comment: editedComment,
    },
  });
});

export const deleteComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    return next(new AppError('Comment not found', 404));
  }

  if (comment.userId !== req.user.id && !req.user.isAdmin) {
    return next(
      new AppError('You are not authorized to perform this action', 403)
    );
  }

  await Comment.findByIdAndDelete(req.params.commentId);

  res.status(200).json({
    status: 'success',
    data: {
      message: 'Comment deleted successfully',
    },
  });
});

export const getComments = catchAsync(async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(
      new AppError('You are not authorized to perform this action', 403)
    );
  }

  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 9;
  const sortDirection = req.query.sort === 'desc' ? -1 : 1;

  const comments = await Comment.find()
    .sort({ createdAt: sortDirection })
    .skip(startIndex)
    .limit(limit);

  const totalComments = await Comment.countDocuments();

  const now = new Date();

  const oneMonthAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate()
  );

  const lastMonthComments = await Comment.countDocuments({
    createdAt: { $gte: oneMonthAgo },
  });

  res.status(200).json({
    status: 'success',
    data: {
      comments,
      totalComments,
      lastMonthComments,
    },
  });
});
