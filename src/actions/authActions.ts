"use server";

import { createSupabaseServerClient } from "@/lib/auth/server";
import { getErrorMessage } from "@/lib/utils";
import {users} from "@/database/schema";
import bcrypt from 'bcrypt'
import db from "@/database/drizzle";

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
    const { error, data: userData } = await auth.signUp(data);

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await db.insert(users).values({
      id: userData.user?.id, // Use Supabase UID
      email: data.email,
      password: hashedPassword,
      fullName: data.fullName,
      address: data.address, // Can be empty ""
      phone: data.phone ?? 0, // Default to 0 if null
    });


    if (error) throw error;

    const { data: signInData, error: loginError } =
      await auth.signInWithPassword(data);

    if (loginError) throw loginError;
    if (!signInData.session) throw new Error("No session");
    return { errorMessage: null };

    //   if (error) {
    //     redirect('/error')
    //   }

    //   revalidatePath('/', 'layout')
    //   redirect('/')
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
    //   if (error) {
    //     redirect('/error')
    //   }

    //   revalidatePath('/', 'layout')
    //   redirect('/')
  } catch (error) {
    return { errorMessage: getErrorMessage(error) };
  }
};

export const signOutAction = async () => {
  const {auth} = await createSupabaseServerClient();
  try {
    const { error } = await auth.signOut();
    if (error) throw error;

    return { errorMessage: null };
  } catch (error) {
    return { errorMessage: getErrorMessage(error) };
  }
};
