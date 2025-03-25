// app/hooks/useFetchstore.ts

"use client";

import { fetchSingleStoreAction } from "@/actions/foodStoreActions";
import { useEffect, useState } from "react";

export interface IStore {
  id: string;
  store_name: string;
  address: string;
  phone:string;
  user: {
    full_name: string;
    id: string;
  };
  menu: {
    id: string;
    item_name: string;
    description: string;
    price: number;
    image: string;
  }[];
}

export const useFetchstore = (storeId: string | undefined) => {
  const [store, setstore] = useState<IStore | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!storeId) {
        setLoading(false);
        setError("store ID is undefined.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { foodStore: fetchedstore, errorMessage } =
          await fetchSingleStoreAction(storeId);

        if (errorMessage) {
          setError(errorMessage);
        } else {
          setstore(fetchedstore);
        }
      } catch (err) {
        setError("Failed to fetch store.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [storeId]);

  return { store, loading, error };
};
