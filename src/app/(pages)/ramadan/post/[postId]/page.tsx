// app/ramadan/post/[id]/PostClient.tsx

"use client";

import { useFetchPost } from "@/hooks/use-fetch-single-post";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@radix-ui/themes/components/button";

export default function PostClient() {
  const { postId } = useParams();
  const { post, loading, error } = useFetchPost(postId as string);
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Submitted:", inputValue, "Post ID:", post?.id);
    // Add your form submission logic here
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!post) {
    return <div>Post not found.</div>;
  }

  return (
    <div className="p-4 max-w-xl mx-auto font-sans">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-gray-900">{post.user.full_name}</CardTitle>
          <CardDescription className="text-gray-600">
            by {post.user.full_name}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">Gender: {post.gender}</p>
          <p className="text-gray-700">Address: {post.address}</p>
          <p className="text-gray-700">Max Guests: {post.max_guests}</p>
          {/* <p className="text-gray-700">Guests: {post.guests.join(", ")}</p> */}
          <p className="text-gray-700">Phone: {post.user.phone}</p>
          {/* <p className="text-gray-700">Created At: {new Date(post.createdAt).toLocaleString()}</p> */}
        </CardContent>  
      </Card>
    </div>
  );
}
