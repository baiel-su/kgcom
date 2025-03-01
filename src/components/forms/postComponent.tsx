import Link from "next/link";
import React from "react";
import dayjs from "dayjs";
import { IPost } from "@/hooks/use-fetch-posts";



const PostComponent: React.FC<{ post: IPost }> = ({ post }) => {
    return (
        <div>
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
                <span>{post.iftar_type ==='dine_in'?'Dine in':'Take out'}</span>
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
    );
};

export default PostComponent;
