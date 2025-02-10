"use server";

import { createSupabaseServerClient } from "@/lib/auth/server";
import { getErrorMessage } from "@/lib/utils";
import {users} from "@/database/schema";

export const signUpAction = async (formData: FormData) => {
  try {
    const { auth } = await createSupabaseServerClient();
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };
    const { error } = await auth.signUp(data);

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
