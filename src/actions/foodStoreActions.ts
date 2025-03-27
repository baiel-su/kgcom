"use server";
import { createSupabaseServerClient } from "@/lib/auth/server";

const createFoodStoreAction = async (formData: FormData, storeId?: string) => {
  const supabase = await createSupabaseServerClient();

  const storeData = {
    store_name: formData.get("store_name") as string,
    description: formData.get("description") as string,
    address: formData.get("address") as string,
    phone: formData.get("phone") as string,
    image: formData.get("image") as string,
    instagram_link: formData.get("instagram_link") as string,
  };

  if (!storeData.store_name || !storeData.address || !storeData.phone) {
    return { error: "Missing required fields" };
  }

  // Check if the user is authenticated
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { errorMessage: "User not authenticated" };
  }

  try {
    // Check if the user already created a store with the same name
    const { data: existingStore, error: fetchError } = await supabase
      .from("food_stores")
      .select("id")
      .eq("user_id", user.id)
      .eq("store_name", storeData.store_name)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116: No rows found
      throw new Error(fetchError.message);
    }

    if (existingStore && !storeId) {
      return {
        errorMessage: "You have already created a store with this name",
      };
    }

    // Insert a new store or update an existing one
    const { error: upsertError } = await supabase.from("food_stores").upsert(
      {
        id: storeId ?? undefined, // Use storeId for update, else create new store
        user_id: user.id,
        store_name: storeData.store_name,
        description: storeData.description,
        address: storeData.address,
        phone: storeData.phone,
        image: storeData.image,
        instagram_link: storeData.instagram_link,
      },
      { onConflict: "id" } // Ensures updates occur when `id` exists
    );

    if (upsertError) throw new Error(upsertError.message);

    return { errorMessage: null };
  } catch (error) {
    console.error("Store creation/update error:", error);
    return {
      errorMessage:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};

export default createFoodStoreAction;

const fetchFoodStoresAction = async () => {
  const supabase = await createSupabaseServerClient();

  try {
    // Fetch all food stores
    const { data: foodStores, error } = await supabase.from("food_stores")
      .select(`
        *,
        user:users (
          full_name,
          id
        )
      `);

    if (error) throw new Error(error.message);

    return { foodStores, errorMessage: null };
  } catch (error) {
    console.error("Error fetching food stores:", error);
    return {
      foodStores: null,
      errorMessage:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};

export { fetchFoodStoresAction };

export const fetchSingleStoreAction = async (storeId: string) => {
  const supabase = await createSupabaseServerClient();

  try {
    // Fetch a food store by its ID
    const { data: foodStore, error } = await supabase
      .from("food_stores")
      .select(
        `
      *,
      menu:food_menu (
        id,
        item_name,
        description,
        price,
        image
      ),
      user:users (
        full_name,
        id
      )
      `
      )
      .eq("id", storeId)
      .single();

    if (error) throw new Error(error.message);

    return { foodStore, errorMessage: null };
  } catch (error) {
    console.error("Error fetching food store by ID:", error);
    return {
      foodStore: null,
      errorMessage:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};

const createFoodMenuAction = async (
  formData: FormData,
  foodStoreId: string
) => {
  const supabase = await createSupabaseServerClient();

  const menuData = {
    item_name: formData.get("item_name") as string,
    description: formData.get("description") as string,
    price: formData.get("price") as string,
    image: formData.get("image") as string,
  };

  if (!menuData.item_name || !menuData.price) {
    return { error: "Missing required fields" };
  }

  // Check if the user is authenticated
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { errorMessage: "User not authenticated" };
  }

  try {
    // Check if the food store exists and belongs to the user
    const { data: foodStore, error: storeError } = await supabase
      .from("food_stores")
      .select("id, user_id")
      .eq("id", foodStoreId)
      .single();

    if (storeError || !foodStore) {
      return { errorMessage: "Food store not found" };
    }

    if (foodStore.user_id !== user.id) {
      return {
        errorMessage: "You are not authorized to add menu items to this store",
      };
    }

    // Insert a new menu item
    const { error: insertError } = await supabase.from("food_menu").insert({
      food_store_id: foodStoreId,
      user_id: user.id,
      item_name: menuData.item_name,
      description: menuData.description,
      price: menuData.price,
      image: menuData.image,
    });

    if (insertError) throw new Error(insertError.message);

    return { errorMessage: null };
  } catch (error) {
    console.error("Menu creation error:", error);
    return {
      errorMessage:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};

export { createFoodMenuAction };
