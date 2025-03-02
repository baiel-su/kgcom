"use server";

import { createSupabaseServerClient } from "@/lib/auth/server";

//
const createPostAction = async (formData: FormData, postId?: string) => {
  const supabase = await createSupabaseServerClient();

  const postData = {
    userId: formData.get("userId") as string,
    gender: formData.get("gender") as string,
    address: formData.get("address") as string,
    iftar_type: formData.get("iftar_type") as string,
    max_guests: Number(formData.get("max_guests")),
    hostDate: new Date(formData.get("hostDate") as string),
  };

  if (isNaN(postData.max_guests)) {
    return { error: "Invalid number input" };
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
    // Check if the user already created a post for the same date
    const { data: existingPost, error: fetchError } = await supabase
      .from("posts")
      .select("id")
      .eq("user_id", user.id)
      .eq("host_date", postData.hostDate.toISOString().split("T")[0])
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116: No rows found
      throw new Error(fetchError.message);
    }

    if (existingPost && !postId) {
      return { errorMessage: "You have already created a post for this date" };
    }

    // Insert a new post or update an existing one
    const { error: upsertError } = await supabase.from("posts").upsert(
      {
        id: postId ?? undefined, // Use postId for update, else create new post
        user_id: user.id,
        gender: postData.gender,
        address: postData.address,
        max_guests: postData.max_guests,
        host_date: postData.hostDate,
        iftar_type: postData.iftar_type,
      },
      { onConflict: "id" } // Ensures updates occur when `id` exists
    );

    if (upsertError) throw new Error(upsertError.message);

    return { errorMessage: null };
  } catch (error) {
    console.error("Post creation/update error:", error);
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
        *,
        user:users!posts_user_id_users_id_fk (
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

export const fetchMyPostsAction = async () => {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { posts: [], errorMessage: "User not authenticated" };
  }

  try {
    const { data: posts, error: fetchError } = await supabase
      .from("posts")
      .select(
        `
      *,
      user:users!posts_user_id_users_id_fk (
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
      .eq("user_id", user?.id);

    if (fetchError) throw new Error(fetchError.message);

    return { posts, errorMessage: null };
  } catch (error) {
    console.error("FetchMyPostsAction error:", error);
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
        user:users!posts_user_id_users_id_fk (
        id,
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

    // Fetch the event date of the post
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("max_guests, host_date")
      .eq("id", postId)
      .single();

    if (postError) {
      console.error("Error fetching post:", postError);
      return { success: false, message: "Error fetching post details" };
    }

    const eventDate = post.host_date;

    // Check if user has already joined another post on the same date
    const { data: existingEntry, error: existingError } = await supabase
      .from("post_guests")
      .select("post_id")
      .eq("user_id", userId)
      .order("post_id", { ascending: false });

    if (existingError) {
      console.error("Error checking existing entry:", existingError);
      return {
        success: false,
        message: "Error verifying existing registration",
      };
    }

    if (existingEntry.length > 0) {
      // Get the post details for the user's existing entry
      const { data: existingPost, error: existingPostError } = await supabase
        .from("posts")
        .select("host_date")
        .eq("id", existingEntry[0].post_id)
        .single();

      if (existingPostError) {
        console.error(
          "Error fetching existing post details:",
          existingPostError
        );
        return {
          success: false,
          message: "Error verifying existing registration",
        };
      }

      if (existingPost.host_date === eventDate) {
        return {
          success: false,
          message: "You have already joined a post for this date.",
        };
      }
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
    const existingGuestEntry = joinedGuests.find((g) => g.user_id === userId);
    const previousGroupSize = existingGuestEntry
      ? existingGuestEntry.group_size
      : 0;

    // Calculate available seats considering previous groupSize
    const seatsOpen = post.max_guests - (totalJoined - previousGroupSize);

    // Check if the new group size is valid
    if (groupSize > seatsOpen) {
      return {
        success: false,
        message: `Not enough seats available. Only ${seatsOpen} available.`,
      };
    }

    if (existingGuestEntry) {
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

export async function deleteMyNameAction(postId: string) {
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

    // Fetch the post guest entry to check if the authenticated user is the creator
    const { data: postGuest, error: fetchError } = await supabase
      .from("post_guests")
      .select("user_id")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .single();

    if (fetchError) {
      console.error("Error fetching post guest entry:", fetchError);
      return { success: false, message: "Error fetching post guest entry" };
    }

    if (!postGuest) {
      return {
        success: false,
        message: "You are not authorized to delete this entry",
      };
    }

    // Delete the user's entry from the "post_guests" table
    const { error: deleteError } = await supabase
      .from("post_guests")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", userId);

    if (deleteError) {
      console.error("Error deleting entry:", deleteError);
      return {
        success: false,
        message: "Error removing your name from the post",
      };
    }

    return {
      success: true,
      message: "Successfully removed your name from the post",
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

export const deletePostAction = async (postId: string, userId: string) => {
  const supabase = await createSupabaseServerClient();

  try {
    // Check if the user is authenticated
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, message: "User not authenticated" };
    }

    // Check if the user is authorized to delete the post
    if (user.id !== userId) {
      return {
        success: false,
        message: "User not authorized to delete the post",
      };
    }

    // Delete the post from the "posts" table
    const { error: deleteError } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId);

    if (deleteError) throw new Error(deleteError.message);

    return { success: true, message: "Post deleted successfully" };
  } catch (error) {
    console.error("Delete post error:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};
