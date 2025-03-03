import { IPost } from "@/hooks/use-fetch-posts";
import Link from "next/link";
import React from "react";

const PostGuest: React.FC<{ post: IPost}> = ({
  post,
}) => {
  return (
    <div className="">
      {post.post_guests.length > 0 &&
        post.post_guests.map((guest, index) => (
          <div className="my-4" key={index}>
            <h3 className="px-2">Guest {index + 1}</h3>
            <div
              key={index}
              className="py-2  p-2 "
            >
              <div className="absolute top-2 right-2">
              </div>
              <p className="">
                <label className="font-semibold">Name: </label>
                <span>{guest.user.full_name}</span>
              </p>
              <p className="">
                <label className="font-semibold">Group size: </label>
                <span>{guest.group_size} guest(s)</span>
              </p>
              <p>
                <label className="font-semibold">Phone: </label>
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
          </div>
        ))}
    </div>
  );
};

export default PostGuest;
