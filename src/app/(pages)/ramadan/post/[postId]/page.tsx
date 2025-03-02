// app/ramadan/post/[id]/PostClient.tsx

"use client";

import { AddMyNameForm } from "@/components/forms/addMyNameForm";
import { DeletePost } from "@/components/forms/deletePost";
import PostComponent from "@/components/forms/postComponent";
import PostForm from "@/components/forms/postForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/authContext";
import { useFetchPost } from "@/hooks/use-fetch-single-post";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function PostClient() {
  const { postId } = useParams<{ postId: string }>();
  const [isClicked, setIsClicked] = useState(false);
  const { post, error } = useFetchPost(postId as string | undefined);
  const { user } = useAuth();
  // console.log(postId)

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
          <CardTitle className="text-2xl text-gray-900">
            Host: {post.user.full_name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {isClicked ? <PostForm post={post} /> : <PostComponent post={post} />}

          <div className="flex flex-col gap-4">
            {!isClicked && <AddMyNameForm postId={postId} />}
            {user?.id === post.user.id && (
              <div className="flex justify-between w-full gap-4">
                <Button
                  className="w-full"
                  onClick={() => setIsClicked(!isClicked)}
                >
                  {isClicked ? "Cancel" : "Edit"}
                </Button>
                {!isClicked && (
                  <DeletePost postId={postId} userId={post.user.id} />
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
