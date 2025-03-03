import { IPost } from "@/hooks/use-fetch-posts";
import dayjs from "dayjs";
import Link from "next/link";
import React from "react";

const PostComponent: React.FC<{ post: IPost }> = ({ post }) => {
  return (
    <div>
      <div className="border rounded-xl bg-gray-50 p-2">
        <p className="text-gray-700">
          <label className="font-semibold">Gender: </label>
          <span>{post.gender}</span>
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
          <label className="font-semibold">Number of guests invited: </label>
          <span>{post.max_guests}</span>
        </p>
        <p className="text-gray-700">
          <label className="font-semibold">Iftar Mode: </label>
          <span>{post.iftar_type === "dine_in" ? "Dine in" : "Take out"}</span>
        </p>
        <p>
          <label className="font-semibold">Hosting Date: </label>
          <span>
            {new Date(post.host_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
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
      </div>
    </div>
  );
};

export default PostComponent;
