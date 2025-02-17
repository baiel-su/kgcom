"use server"
import { createSupabaseServerClient } from "@/lib/auth/server";

export const fetchUserData = async () => {
  const supabase = await createSupabaseServerClient();
  // Get the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null; // If no user, return null
  console.log('user:',user)

  // Fetch the user's data from the `users` table
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id) // Assuming 'id' is the primary key
    .single();

  if (error) {
    console.error("Error fetching user data:", error);
    return null;
  }

  return data;
};
