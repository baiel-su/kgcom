// app/hooks/useFetchPost.ts

"use client";

import { fetchSinglePostAction } from "@/actions/postActions";
import { useEffect, useState } from "react";
import { IPost } from "./use-fetch-posts";


export const useFetchPost = (postId: string | undefined) => {
  const [post, setPost] = useState<IPost | null>(null);
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
