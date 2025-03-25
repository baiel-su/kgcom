"use client";
import StoreCard from "@/components/catering/storeCards";
import { Button } from "@/components/ui/button";
import { useFetchFoodStores } from "@/hooks/use-fetch-stores";
import Link from "next/link";

const Stores = () => {
  const { foodStores } = useFetchFoodStores();
  return (
    <div className="p-4 mb-20">
      <h1 className="text-2xl font-bold text-center mt-4">Food Stores</h1>
      <p className="text-center mt-2">Explore our variety of food stores</p>
      <div className="w-full m-auto flex justify-center mt-4">
        <Link href={"/catering/apply"}>
          <Button className="bg-purple-600 m-auto">Open Store! </Button>
        </Link>
      </div>
      {foodStores?.map((store, i) => (
        <div key={i} className="mt-4">
          <StoreCard
            id={store.id}
            image={store.image}
            store_name={store.store_name}
            description={store.description}
          />
        </div>
      ))}
    </div>
  );
};

export default Stores;
