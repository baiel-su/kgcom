// app/ramadan/post/[id]/PostClient.tsx

"use client";

import { AddMyNameForm } from "@/components/forms/addMyNameForm";
import { DeletePost } from "@/components/forms/deletePost";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/authContext";
import { useFetchPost } from "@/hooks/use-fetch-single-post";
import dayjs from "dayjs";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PostClient() {
  const { postId } = useParams<{ postId: string }>();
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
          <div>
            <p className="text-gray-700">
              <label className="font-semibold">Gender: </label>
              <span></span>
              {post.gender}
            </p>
            <p className="text-gray-700">
              <label className="font-semibold">Address: </label>
              <Link
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  post.address
                )}`}
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {post.address}
              </Link>
            </p>
            <p className="text-gray-700">
              <label className="font-semibold">
                Number of guests invited:{" "}
              </label>
              <span>{post.max_guests}</span>
            </p>
            <p>
              <label className="font-semibold">Hosting Date: </label>
              <span>{dayjs(post.host_date).format("MM-DD-YYYY")}</span>
            </p>
            <p className="text-gray-700">
              <label className="font-semibold">Phone: </label>
              <Link
                href={`https://wa.me/+1${post.user.phone}`}
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                +1{post.user.phone}
              </Link>
            </p>
            {post.post_guests.length > 0 &&
              post.post_guests.map((guest, index) => (
                <div key={index} className="py-2">
                  <p className="text-gray-700">
                    <label className="font-semibold">Guest {index + 1}: </label>
                    <span>{guest.user.full_name}</span>
                  </p>
                  <p className="text-gray-700">
                    <label className="font-semibold">Group {index + 1}: </label>
                    <span>{guest.group_size} guest(s)</span>
                  </p>
                  <p>
                    <label className="font-semibold">Guest: </label>
                    <Link
                      href={`https://wa.me/+1${guest.user.phone}`}
                      className="text-blue-500 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      +1{guest.user.phone}
                    </Link>
                  </p>
                </div>
              ))}
          </div>
          <div className="flex flex-col gap-4">
            <AddMyNameForm postId={postId} />
            {user && (
              <div className="flex justify-between w-full gap-4">
                <Button className="w-full">Edit</Button>
                <DeletePost postId={postId} userId={user.id} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
