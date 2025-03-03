"use server";

import { createSupabaseServerClient } from "@/lib/auth/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const data = {
    full_name: formData.get("full_name") as string,
    phone: formData.get("phone") as string,
  };

  // Check if required fields are available
  if (!data.full_name || !data.phone) {
    return { errorMessage: "All fields are required" };
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
    // Fetch the current email and password values
    const { data: userProfile, error: profileError } = await supabase
      .from("users")
      .select("email, password")
      .eq("id", user.id)
      .single();

    if (profileError) throw new Error(profileError.message);

    // Update profile data in the "users" table
    const { error: updateError } = await supabase.from("users").upsert({
      id: user.id,
      full_name: data.full_name,
      phone: data.phone,
      email: userProfile.email, // Include the current email value
      password: userProfile.password, // Include the current password value
      // updated_at: new Date().toISOString(),
    });

    if (updateError) throw new Error(updateError.message);

    // Revalidate the profile page to update the UI
    revalidatePath("/profile");

    return { errorMessage: null };
  } catch (error) {
    console.error("Profile update error:", error);
    return {
      errorMessage:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
