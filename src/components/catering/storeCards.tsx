import Image from "next/image";
import Link from "next/link";
import React from "react";

interface StoreCardProps {
  imageSrc: string;
  name: string;
  description: string;
}

const StoreCard: React.FC<StoreCardProps> = ({ imageSrc, name , description}) => {
  return (
    <div className="border rounded-lg shadow-md overflow-hidden text-start">
      <Image
        alt={name}
        src={imageSrc}
        layout="responsive"
        width={400}
        height={300}
        className="object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold ">{name}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default StoreCard;
