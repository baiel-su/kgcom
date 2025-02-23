import { fetchPostsAction } from '@/actions/postActions'; // Import your fetchPostsAction
import { useEffect, useState } from 'react';

export interface Post {
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

// import { useState, useEffect } from 'react';
// import dayjs from "dayjs";
// import utc from "dayjs/plugin/utc";
// import timezone from "dayjs/plugin/timezone";
// import { fetchPostsAction } from '@/actions/postActions';

// // Extend Day.js with plugins
// dayjs.extend(utc);
// dayjs.extend(timezone);

// interface Post {
//   id: string;
//   gender: string;
//   address: string;
//   max_guests: number;
//   guests: string[];
//   user: {
//     full_name: string;
//     phone: string;
//   };
//   createdAt: string;
// }

// interface UseFetchPostsResult {
//   posts: Post[] | null;
//   error: string | null;
//   loading: boolean;
//   refetch: () => void;
// }

// export const convertToCentralTime = (supabaseTimestamp: string) => {
//   return dayjs.utc(supabaseTimestamp).tz("America/Chicago").format("YYYY-MM-DD HH:mm:ss");
// };

// const useFetchPosts = (): UseFetchPostsResult => {
//   const [posts, setPosts] = useState<Post[] | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   const fetchPosts = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const { posts: fetchedPosts, errorMessage } = await fetchPostsAction();

//       if (errorMessage) {
//         setError(errorMessage);
//         setPosts([]);
//       } else {
//         // Convert createdAt to Central Time and sort
//         const processedPosts = fetchedPosts
//           .map((post) => ({
//             ...post,
//             createdAt: convertToCentralTime(post.createdAt),
//           }))
//           .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

//         setPosts(processedPosts);
//       }
//     } catch (err: any) {
//       console.error("Error in useFetchPosts:", err);
//       setError(err instanceof Error ? err.message : "An unexpected error occurred");
//       setPosts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPosts();
//   }, []);

//   const refetch = () => {
//     fetchPosts();
//   };

//   return { posts, error, loading, refetch };
// };


// export default useFetchPosts;