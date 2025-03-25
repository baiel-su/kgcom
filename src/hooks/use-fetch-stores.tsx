import { fetchFoodStoresAction } from "@/actions/foodStoreActions";
import { useEffect, useState } from "react";

interface FoodStore {
  id: string;

  user: {
    full_name: string;
    user_id: string;
  };
  store_name: string;
  description?: string;
  address: string;
  phone: string;
  image?: string;
  instagramLink?: string;
  createdAt: Date;
}

export const useFetchFoodStores = () => {
  const [foodStores, setFoodStores] = useState<FoodStore[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null); // Clear previous errors

    try {
      const { foodStores: fetchedPosts, errorMessage } =
        await fetchFoodStoresAction();

      if (errorMessage) {
        setError(errorMessage);
        setFoodStores([]); // Clear posts on error
      } else {
        setFoodStores(fetchedPosts);
      }
    } catch (err) {
      // Catch any unexpected errors
      console.error("Error in useFetchPosts:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setFoodStores([]); // Clear posts on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return { foodStores, loading, error };
};
