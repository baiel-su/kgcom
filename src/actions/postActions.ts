"use server";

import { createSupabaseServerClient } from "@/lib/auth/server";

const createPostAction = async (formData: FormData) => {
  const supabase = await createSupabaseServerClient();

  const postData = {
    userId: formData.get("userId") as string,
    gender: formData.get("gender") as string,
    address: formData.get("address") as string,
    users: JSON.parse(formData.get("guests") as string) || "[]", // Parse the JSON string to an array
    max_guests: Number(formData.get("max_guests")),
  };

  if (isNaN(postData.max_guests)) {
    return { error: "Invalid number input" }; // Handle errors appropriately
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
    // Insert the post into the "posts" table (id is auto-generated)
    const { error: insertError } = await supabase.from("posts").upsert({
      user_id: user.id,
      gender: postData.gender,
      address: postData.address,
      users: postData.users,
      max_guests: postData.max_guests,
    });

    if (insertError) throw new Error(insertError.message);

    return { errorMessage: null };
  } catch (error) {
    console.error("Post creation error:", error);
    return {
      errorMessage:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};

export default createPostAction;

export const addMyNameAction = async (formData: FormData) => {
  const supabase = await createSupabaseServerClient();

  const data = {
    userId: formData.get("userId") as string,
    postId: formData.get("postId") as string,
  };

  // Check if the user is authenticated
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { errorMessage: "User not authenticated" };
  }

  try {
    // Fetch the existing post
    const { data: post, error: fetchError } = await supabase
      .from("posts")
      .select("users")
      .eq("id", data.postId)
      .single();

    if (fetchError || !post) {
      throw new Error(fetchError ? fetchError.message : "Post not found");
    }

    // Add the user ID to the users array
    const updatedUsers = [...post.users, user.id];

    // Update the post with the new users array
    const { error: updateError } = await supabase
      .from("posts")
      .update({ users: updatedUsers })
      .eq("id", data.postId);

    if (updateError) throw new Error(updateError.message);

    return { errorMessage: null };
  } catch (error) {
    console.error("AddMyNameAction error:", error);
    return {
      errorMessage:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};

export const fetchPostsAction = async () => {
  const supabase = await createSupabaseServerClient();

  try {
    const { data: posts, error: fetchError } = await supabase.from("posts")
      .select(`
     *,user:users (
        full_name,
        phone
      )
    `);

    console.log(posts);

    if (fetchError) throw new Error(fetchError.message);

    return { posts, errorMessage: null };
  } catch (error) {
    console.error("FetchPostsAction error:", error);
    return {
      posts: [],
      errorMessage:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};
