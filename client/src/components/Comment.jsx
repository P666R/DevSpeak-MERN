import moment from 'moment';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
  onLike: PropTypes.func.isRequired,
};

function Comment({ comment, onLike }) {
  const [user, setUser] = useState({});

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/v1/user/${comment.userId}`);
        const data = await res.json();

        if (res.ok && data.status === 'success') {
          const {
            data: { user },
          } = data;
          setUser(user);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getUser();
  }, [comment.userId]);

  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          className="w-10 h-10 rounded-full bg-gray-200"
          src={user.profilePicture}
          alt={user.username}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user ? `@${user.username}` : 'anonymous user'}
          </span>
          <span className="text-xs text-gray-500">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        <p className="text-gray-500 pb-2">{comment.content}</p>
        <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2 ">
          <button
            type="button"
            className={`hover:text-blue-500 ${
              currentUser && comment.likes.includes(currentUser._id)
                ? 'text-blue-500'
                : 'text-gray-400'
            }`}
            onClick={() => onLike(comment._id)}
          >
            <FaThumbsUp className="text-sm" />
          </button>
          <p className="text-gray-400">
            {comment.numberOfLikes > 0 &&
              comment.numberOfLikes +
                ' ' +
                (comment.numberOfLikes === 1 ? 'like' : 'likes')}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Comment;
