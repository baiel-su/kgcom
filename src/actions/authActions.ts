"use server";

import db from "@/database/drizzle";
import { users } from "@/database/schema";
import { createSupabaseServerClient } from "@/lib/auth/server";
import { getErrorMessage } from "@/lib/utils";
import bcrypt from "bcrypt";

export const signUpAction = async (formData: FormData) => {
  try {
    const { auth } = await createSupabaseServerClient();
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      full_name: (formData.get("fullName") as string) || "", // Default empty string
      address: (formData.get("address") as string) || "", // Default empty string
      phone: (formData.get("phone") as string) || "",
    };
    const { data: signUpData, error } = await auth.signUp(data);

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await db.insert(users).values({
      id: signUpData.user ? signUpData.user.id : "",
      email: data.email,
      password: hashedPassword,
      full_name: data.full_name,
      address: data.address, // Can be empty ""
      phone: data.phone ? data.phone.toString() : "",
    });

    if (error) throw error;

    const { data: signInData, error: loginError } =
      await auth.signInWithPassword(data);

    if (loginError) throw loginError;
    if (!signInData.session) throw new Error("No session");
    return { errorMessage: null };
  } catch (error) {
    return { errorMessage: getErrorMessage(error) };
  }
};

export const signInAction = async (formData: FormData) => {
  try {
    const { auth } = await createSupabaseServerClient();

    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };
    const { data: signInData, error: loginError } =
      await auth.signInWithPassword(data);
    if (loginError) throw loginError;
    if (!signInData.session) throw new Error("No session");

    return { errorMessage: null };
  } catch (error) {
    return { errorMessage: getErrorMessage(error) };
  }
};

export const signOutAction = async () => {
  const { auth } = await createSupabaseServerClient();
  try {
    const { error } = await auth.signOut();
    if (error) throw error;

    // Refresh the page after successful sign out

    return { errorMessage: null };
  } catch (error) {
    return { errorMessage: getErrorMessage(error) };
  }
};

export const sendResetPasswordEmail = async (formData: FormData) => {
  try {
    const { auth } = await createSupabaseServerClient();

    const email = formData.get("email") as string;

    if (!email) throw new Error("Email is required");

    const { error } = await auth.resetPasswordForEmail(email);

    if (error) throw error;

    return { errorMessage: null };
  } catch (error) {
    return { errorMessage: getErrorMessage(error) };
  }
};
export const updatePassword = async (formData: FormData)  => {

  try {
    const { auth } = await createSupabaseServerClient();

    const password = formData.get("password") as string;

    if (!password) throw new Error("New password is required");

    const { error } = await auth.updateUser({ password });

    if (error) throw error;

    return { errorMessage: null };
  } catch (error) {
    return { errorMessage: getErrorMessage(error) };
  }
};
