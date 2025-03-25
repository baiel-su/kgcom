"use server"
import { createSupabaseServerClient, getUser } from '@/lib/auth/server';

const fetchUserProfileAction = async () => {
  try {
    const supabase = await createSupabaseServerClient();
    const user = await getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching user profile:', error.message);
      console.error(error.stack);
    } else {
      console.error('Error fetching user profile:', error);
    }
    throw new Error('Failed to fetch user profile');
  }
}

export default fetchUserProfileAction;