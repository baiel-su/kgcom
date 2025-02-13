import { cookies } from "next/headers";
import { createServerClient} from "@supabase/ssr";
import { redirect } from "next/navigation";


export const createSupabaseServerClient = async () => {
    const cookieStore = await cookies(); 
  
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet) => {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // This can be ignored if middleware is handling session refresh
            }
          },
        },
      }
    );
  
  };

  export async function getUser() {
    const { auth } = await createSupabaseServerClient();
    const user = (await auth.getUser()).data.user;
  
    return user;
  }