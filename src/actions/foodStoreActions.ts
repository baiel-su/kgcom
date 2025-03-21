'use server'
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
            return { errorMessage: "You have already created a store with this name" };
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