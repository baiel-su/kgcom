import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

interface FoodStore {
  id: string;
  user?: {
    full_name?: string;
    user_id?: string;
  };
  store_name?: string;
  description?: string;
  address?: string;
  phone?: string;
  image?: string;
  instagramLink?: string;
}

const StoreCard: React.FC<FoodStore> = ({
  id,
  store_name,
  description,
  image,
}) => {
  return (
    <Card className="overflow-hidden ">
      {image && (
        <div className="relative w-[400px] h-[200px]">
          <Image
            alt={store_name as string}
            src={image}
            layout="fill"
            objectFit="cover"
            className="object-cover"
          />
        </div>
      )}
      <CardContent className="px-4">
        <div className="pt-4 px-0">
          <h2 className="text-lg font-semibold">{store_name}</h2>
          <p>{description}</p>
        </div>
        <Link href={`/catering/stores/${id}`} >
          <Button className="mt-4">See store</Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default StoreCard;
