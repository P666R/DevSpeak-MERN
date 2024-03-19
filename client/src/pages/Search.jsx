import { Button, Select, TextInput } from 'flowbite-react';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';

function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    order: 'desc',
    category: '',
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const { search } = useLocation();
  const navigate = useNavigate();

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const urlParams = new URLSearchParams(search);
      const searchQuery = urlParams.toString();

      const res = await fetch(`/api/v1/post/getposts?${searchQuery}`);
      const data = await res.json();

      if (!res.ok && data.status !== 'success') {
        console.log(data.message);
        setLoading(false);
        return;
      }

      const {
        data: { posts },
      } = data;
      setPosts(posts);
      setLoading(false);
      setShowMore(posts.length === 9);
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    const urlParams = new URLSearchParams(search);
    const searchTermFromUrl = urlParams.get('searchTerm') || '';
    const orderFromUrl = urlParams.get('order') || 'desc';
    const categoryFromUrl = urlParams.get('category') || '';

    setSidebarData({
      searchTerm: searchTermFromUrl,
      order: orderFromUrl,
      category: categoryFromUrl,
    });
  }, [search]);

  const handleChange = (e) => {
    setSidebarData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('order', sidebarData.order);
    urlParams.set('category', sidebarData.category);

    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const startIndex = posts.length;
    const urlParams = new URLSearchParams(search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();

    try {
      const res = await fetch(`/api/v1/post/getposts?${searchQuery}`);
      const data = await res.json();

      if (!res.ok && data.status !== 'success') {
        console.log(data.message);
        return;
      }

      const {
        data: { posts },
      } = data;
      setPosts((prevPosts) => [...prevPosts, ...posts]);
      setShowMore(posts.length === 9);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <TextInput
              placeholder="Search..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <Select
              onChange={handleChange}
              value={sidebarData.order}
              id="order"
            >
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Category:</label>
            <Select
              onChange={handleChange}
              value={sidebarData.category}
              id="category"
            >
              <option value="">Uncategorized</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="nodejs">NodeJS</option>
              <option value="reactjs">ReactJS</option>
              <option value="nextjs">NextJS</option>
              <option value="golang">Golang</option>
            </Select>
          </div>
          <Button type="submit" outline gradientDuoTone="purpleToPink">
            Apply Filters
          </Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 ">
          Posts results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gray-500">No posts found</p>
          )}
          {loading && <p className="text-xl text-gray-500">Loading...</p>}
          {!loading &&
            posts &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
          {showMore && (
            <button
              onClick={handleShowMore}
              className="text-teal-500 text-lg hover:underline p-7 w-full"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
