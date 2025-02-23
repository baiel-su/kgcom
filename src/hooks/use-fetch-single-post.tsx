// app/hooks/useFetchPost.ts

"use client";

import { fetchSinglePostAction } from "@/actions/postActions";
import { useEffect, useState } from "react";

export interface Post {
  id: string;
  gender: string;
  address: string;
  max_guests: number;
  post_guests: {
    group_size: number;
    user: {
      id: string;
      full_name: string;
      phone: string;
    };
  }[];
  user: {
    full_name: string;
    phone: string;
  };
  createdAt: string;
  host_date: string;
}

export const useFetchPost = (postId: string | undefined) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!postId) {
        setLoading(false);
        setError("Post ID is undefined.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { post: fetchedPost, errorMessage } = await fetchSinglePostAction(postId);

        if (errorMessage) {
          setError(errorMessage);
        } else {
          setPost(fetchedPost);
        }
      } catch (err) {
        setError("Failed to fetch post.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [postId]);

  return { post, loading, error };
};
