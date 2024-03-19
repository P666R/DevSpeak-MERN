import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/v1/post/getposts');

        const data = await res.json();

        if (!res.ok && data.status !== 'success') {
          console.log(data.message);
          return;
        }

        if (res.ok && data.status === 'success') {
          const {
            data: { posts },
          } = data;
          setPosts(posts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-6 px-3 p-28 max-w-6xl mx-auto ">
        <h1 className="text-3xl font-bold lg:text-6xl">
          Welcome to DevSpeak Blog
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm">
          Welcome to DevSpeak, your go-to destination for all things related to
          software development, technology trends, coding tips, and much more.
          Whether you&apos;re a seasoned developer or just starting your journey
          in the world of programming, DevSpeak is here to inspire, educate, and
          empower you.
        </p>
        <Link
          to="/search"
          className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
        >
          View all posts
        </Link>
      </div>
      <div className="p-3 bg-amber-100 dark:bg-slate-700">
        <CallToAction />
      </div>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center">Recent Posts</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to={'/search'}
              className="text-lg text-teal-500 hover:underline text-center"
            >
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
