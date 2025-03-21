import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

interface StoreCardProps {
  imageSrc: string;
  name: string;
  description: string;
  id: number;
}

const StoreCard: React.FC<StoreCardProps> = ({
  imageSrc,
  name,
  description,
  id
}) => {
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
      <Link href={`/catering/stores/${id}`}>
      <Button>See store</Button></Link>
    </div>
  );
};

export default StoreCard;
