"use server";

import { createSupabaseServerClient } from "@/lib/auth/server";

const createPostAction = async (formData: FormData) => {
  const supabase = await createSupabaseServerClient();

  const postData = {
    userId: formData.get("userId") as string,
    gender: formData.get("gender") as string,
    address: formData.get("address") as string,
    max_guests: Number(formData.get("max_guests")),
    hostDate: new Date(formData.get("hostDate") as string),
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
      max_guests: postData.max_guests,
      host_date: postData.hostDate,
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

export const fetchSinglePostAction = async (postId: string) => {
  const supabase = await createSupabaseServerClient();

  try {
    const { data: post, error: fetchError } = await supabase
      .from("posts")
      .select(
        `
        *,
        user:users (
          full_name,
          phone
        ),
        post_guests (
          group_size,
          user:users (
            id,
            full_name,
            phone
          )
        )
      `
      )
      .eq("id", postId) // Filter by postId
      .single(); // Expect a single result

    if (fetchError) throw new Error(fetchError.message);

    if (!post) {
      return { post: null, errorMessage: "Post not found" };
    }

    return { post, errorMessage: null };
  } catch (error) {
    console.error("FetchSinglePostAction error:", error);
    return {
      post: null,
      errorMessage:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};

export async function addMyNameAction({
  postId,
  groupSize,
}: {
  postId: string;
  groupSize: number;
}) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, message: "Unauthorized: Please log in" };
    }

    const userId = user.id;

    if (!postId || groupSize <= 0) {
      return { success: false, message: "Invalid input data" };
    }

    // Fetch post max_guests
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("max_guests")
      .eq("id", postId)
      .single();

    if (postError) {
      console.error("Error fetching post:", postError);
      return { success: false, message: "Error fetching post details" };
    }

    // Fetch total guests already joined
    const { data: joinedGuests, error: guestsError } = await supabase
      .from("post_guests")
      .select("user_id, group_size")
      .eq("post_id", postId);

    if (guestsError) {
      console.error("Error fetching guests:", guestsError);
      return { success: false, message: "Error fetching guest data" };
    }

    // Calculate current total guests
    const totalJoined = joinedGuests.reduce((sum, g) => sum + g.group_size, 0);
    const existingEntry = joinedGuests.find((g) => g.user_id === userId);
    const previousGroupSize = existingEntry ? existingEntry.group_size : 0;

    // Calculate available seats considering previous groupSize
    const seatsOpen = post.max_guests - (totalJoined - previousGroupSize);

    // Check if the new group size is valid
    if (groupSize > seatsOpen) {
      return {
        success: false,
        message: `Not enough seats available. Only ${seatsOpen} available.`,
      };
    }

    if (existingEntry) {
      // Update existing entry
      const { error: updateError } = await supabase
        .from("post_guests")
        .update({ group_size: groupSize })
        .eq("post_id", postId)
        .eq("user_id", userId);

      if (updateError) {
        console.error("Error updating entry:", updateError);
        return { success: false, message: "Error updating group size" };
      }
    } else {
      // Insert new entry
      const { error: insertError } = await supabase.from("post_guests").insert({
        post_id: postId,
        user_id: userId,
        group_size: groupSize,
      });

      if (insertError) {
        console.error("Error inserting post guest:", insertError);
        return { success: false, message: "Error joining the post" };
      }
    }

    return {
      success: true,
      message: "Successfully joined or updated the post",
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
