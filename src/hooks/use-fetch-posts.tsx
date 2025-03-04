import { fetchPostsAction } from "@/actions/postActions"; // Import your fetchPostsAction
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
  seatsLeft: Map<string, number>; // Add seatsLeft property
  error: string | null;
  loading: boolean;
  refetch: () => void; // Add refetch functionality
}


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

const useFetchPosts = (): UseFetchPostsResult => {
  const [posts, setPosts] = useState<IPost[] | null>(null); // Initialize as null
  const [seatsLeft, setSeatsLeft] = useState<Map<string, number>>(new Map()); // Map to store seats left per post
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

  useEffect(() => {
    if (posts) {
      const newSeatsLeft = new Map<string, number>();
      posts.forEach((post) => {
        const totalGuests = post.post_guests.reduce(
          (acc, guest) => acc + guest.group_size,
          0
        );
        newSeatsLeft.set(post.id, post.max_guests - totalGuests);
      });
      setSeatsLeft(newSeatsLeft); // Update the seatsLeft state with the calculated values
    }
  }, [posts]);

  const refetch = () => {
    fetchPosts();
  };

  return { posts, seatsLeft, error, loading, refetch };
};

export default useFetchPosts;
