"use server";

import db from "@/database/drizzle";
import { users } from "@/database/schema";
import { createSupabaseServerClient } from "@/lib/auth/server";
import { getErrorMessage } from "@/lib/utils";
import bcrypt from 'bcrypt';

export const signUpAction = async (formData: FormData) => {
  try {
    const { auth } = await createSupabaseServerClient();
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      fullName: formData.get("fullName") as string || "", // Default empty string 
      address: (formData.get("address") as string) || "", // Default empty string
      phone: formData.get("phone") ? parseInt(formData.get("phone") as string, 10) : null, // Convert to integer or set null
    };
    const { error } = await auth.signUp(data);

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await db.insert(users).values({
      email: data.email,
      password: hashedPassword,
      fullName: data.fullName,
      address: data.address, // Can be empty ""
      phone: data.phone ? data.phone.toString() : "0", // Convert to string or default to "0"
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
    const {auth} = await createSupabaseServerClient();

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
  const {auth} = await createSupabaseServerClient();
  try {
    const { error } = await auth.signOut();
    if (error) throw error;

    // Refresh the page after successful sign out
   
    return { errorMessage: null };
  } catch (error) {
    return { errorMessage: getErrorMessage(error) };
  }
};
