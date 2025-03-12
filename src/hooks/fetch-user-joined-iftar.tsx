import { fetchJoinedPostsAction } from "@/actions/postActions"; // Import your fetchPostsAction
import { useEffect, useState } from "react";

export interface IPost {
  id: string;
  gender: string;
  address: string;
  max_guests: number;
  iftar_type: string;
  post_guests: {
    group_size: number;
    user: {
      id: string;
      full_name: string;
      phone: string;
    };
  }[];
  user: {
    id: string;
    full_name: string;
    phone: string;
  };
  createdAt: string;
  host_date: string;
}

interface UseFetchPostsResult {
  posts: IPost[] | null; // Allow for null posts initially
  error: string | null;
  loading: boolean;
  refetch: () => void; // Add refetch functionality
}

const useFetchMyJoinedIftars = (): UseFetchPostsResult => {
  const [posts, setPosts] = useState<IPost[] | null>(null); // Initialize as null
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null); // Clear previous errors

    try {
      const { posts: fetchedPosts, errorMessage }: { posts: IPost[], errorMessage: string | null } = await fetchJoinedPostsAction() as { posts: IPost[], errorMessage: string | null };

      if (errorMessage) {
        setError(errorMessage);
        setPosts([]); // Clear posts on error
      } else {
        setPosts(fetchedPosts);
      }
    } catch (err) {
      // Catch any unexpected errors
      console.error("Error in useFetchPosts:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
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

export default useFetchMyJoinedIftars;


