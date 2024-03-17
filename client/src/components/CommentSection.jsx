import { Alert, Button, Textarea } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Comment from './Comment';

CommentSection.propTypes = {
  postId: PropTypes.string.isRequired,
};

function CommentSection({ postId }) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [commentError, setCommentError] = useState(null);
  const [commentsError, setCommentsError] = useState(null);

  const { currentUser } = useSelector((state) => state.user);

  async function handleSubmit(e) {
    e.preventDefault();

    if (comment > 200) {
      return;
    }

    try {
      setCommentError(null);
      const res = await fetch('/api/v1/comment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          content: comment,
          userId: currentUser._id,
        }),
      });

      const data = await res.json();

      if (res.ok && data.status === 'success') {
        const {
          data: { comment },
        } = data;
        setComment('');
        setCommentError(null);
        setComments([comment, ...comments]);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  }

  useEffect(() => {
    const getComments = async () => {
      setCommentsError(null);
      try {
        const res = await fetch(`/api/v1/comment/getpostcomments/${postId}`);

        const data = await res.json();

        if (!res.ok || data.status !== 'success') {
          return setCommentsError(data.message || 'Something went wrong');
        }

        if (res.ok && data.status === 'success') {
          const {
            data: { comments },
          } = data;
          setComments(comments);
          setCommentsError(null);
        }
      } catch (error) {
        setCommentsError(error.message);
      }
    };

    getComments();
  }, [postId]);

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as&nbsp;</p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={currentUser.profilePicture}
            alt={currentUser.username}
          />
          <Link
            to={`/dashboard?tab=profile`}
            className="text-xs text-cyan-600 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="my-5 text-teal-500 text-sm flex gap-1">
          You must be signed in to comment
          <Link to="/sign-in" className=" text-blue-500 hover:underline">
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          className="border border-teal-500 rounded-md p-3"
          onSubmit={handleSubmit}
        >
          <Textarea
            placeholder="Add a comment..."
            rows="3"
            maxLength="200"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex justify-between mt-5 items-center">
            <p className="text-gray-500 text-xs">
              {200 - comment.length} characters remaining
            </p>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color="failure" className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}
      {comments.length === 0 ? (
        <p className="text-sm my-5">No comments yet!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <Comment key={comment._id} comment={comment} />
          ))}
        </>
      )}
    </div>
  );
}

export default CommentSection;