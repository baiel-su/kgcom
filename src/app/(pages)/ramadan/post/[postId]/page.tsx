// app/ramadan/post/[id]/PostClient.tsx

"use client";

import { AddMyNameForm } from "@/components/forms/addMyNameForm";
import DeleteMyName from "@/components/forms/deleteMyName";
import { DeletePost } from "@/components/forms/deletePost";
import PostComponent from "@/components/forms/postComponent";
import PostForm from "@/components/forms/postForm";
import PostGuest from "@/components/forms/postGuest";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/authContext";
import { useFetchPost } from "@/hooks/use-fetch-single-post";
import { EllipsisVertical } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function PostClient() {
  const { postId } = useParams<{ postId: string }>();
  const [isClicked, setIsClicked] = useState(false);
  const [isGuestClicked, setIsGuestClicked] = useState(false);
  const { post, error } = useFetchPost(postId as string | undefined);
  const { user } = useAuth();
  // console.log(postId)

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!post) {
    return <div>Post not found.</div>;
  }

  const userExists = post.post_guests.some(
    (guest) => guest.user.id === user?.id
  );

  return (
    <div className="p-4 max-w-xl mx-auto font-sans relative">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-gray-900">
            Host: {post.user.full_name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {isClicked ? (
            <PostForm post={post} />
          ) : (
            <div className="">
              <PostComponent post={post} />
              <div className="p-2 border rounded-xl bg-gray-50 my-4 relative">
                {isGuestClicked ? (
                  <AddMyNameForm postId={post.id} />
                ) : (
                  <PostGuest post={post} />
                )}
                {userExists && (
                  <div className="flex gap-2 absolute top-4 right-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <EllipsisVertical className="text-gray-500" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => setIsGuestClicked(!isGuestClicked)}
                        >
                          {isGuestClicked ? "Cancel" : "Edit"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <DeleteMyName postId={post.id} />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {!isClicked && !userExists && user?.id != post.user.id && (
              <AddMyNameForm postId={post.id} />
            )}

            {user?.id === post.user.id && (
              <div className="absolute top-11 right-10">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <EllipsisVertical />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setIsClicked(!isClicked)}>
                      {isClicked ? "Cancel" : "Edit"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem>
                      <DeletePost postId={postId} userId={post.user.id} />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
