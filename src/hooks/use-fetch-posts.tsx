import { useState, useEffect } from 'react';
import { fetchPostsAction } from '@/actions/postActions'; // Import your fetchPostsAction

interface Post {
  id: string;
  gender: string;
  address: string;
  max_guests: number;
  guests: string[]; // Assuming guests is an array of strings (user IDs or names)
  user: {
    full_name: string;
    phone: string;
  };
  createdAt: string;
}

interface UseFetchPostsResult {
  posts: Post[] | null; // Allow for null posts initially
  error: string | null;
  loading: boolean;
  refetch: () => void; // Add refetch functionality
}

const useFetchPosts = (): UseFetchPostsResult => {
  const [posts, setPosts] = useState<Post[] | null>(null); // Initialize as null
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null); // Clear previous errors

    try {
      const { posts: fetchedPosts, errorMessage } = await fetchPostsAction();

      if (errorMessage) {
        setError(errorMessage);
        setPosts([]); // Clear posts on error
      } else {
        setPosts(fetchedPosts);
      }
    } catch (err: any) { // Catch any unexpected errors
      console.error("Error in useFetchPosts:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setPosts([]); // Clear posts on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const refetch = () => {
    fetchPosts();
  };

  return { posts, error, loading, refetch };
};

export default useFetchPosts;