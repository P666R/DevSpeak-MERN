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
