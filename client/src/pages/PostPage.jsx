import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Alert, Button, Spinner } from 'flowbite-react';
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';

function PostPage() {
  const [loading, setLoading] = useState(true);
  const [postError, setPostError] = useState(null);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);

  const { postSlug } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setPostError(null);
      try {
        const res = await fetch(`/api/v1/post/getposts?slug=${postSlug}`);

        const data = await res.json();

        if (!res.ok || data.status !== 'success') {
          setPostError(data?.message || 'Something went wrong');
          setLoading(false);
          return;
        }

        if (res.ok && data.status === 'success') {
          const {
            data: { posts },
          } = data;
          setPost(posts[0]);
          setLoading(false);
          setPostError(null);
        }
      } catch (error) {
        setPostError(error.message);
        setLoading(false);
      }
    };

    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch('/api/v1/post/getposts?limit=3');
        const data = await res.json();

        if (res.ok && data.status === 'success') {
          const {
            data: { posts },
          } = data;
          setRecentPosts(posts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchRecentPosts();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post && post.title}
      </h1>
      <Link
        to={`/search?category=${post && post.category}`}
        className="self-center mt-5"
      >
        <Button color="gray" pill size="xs">
          {post && post.category}
        </Button>
      </Link>
      <img
        src={post && post.image}
        alt={post && post.title}
        className="mt-10 p-3 max-h-[600px] w-full object-cover"
      />
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {((post && post.content.length / 1000) || 0).toFixed(0)} mins read
        </span>
      </div>
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>
      <CommentSection postId={post && post._id} />
      {postError && (
        <Alert color="failure" className="mt-5">
          {postError}
        </Alert>
      )}
      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-xl mt-5">Recent articles</h1>
        <div className="flex flex-wrap gap-5 mt-5 justify-center">
          {recentPosts &&
            recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
    </main>
  );
}

export default PostPage;
