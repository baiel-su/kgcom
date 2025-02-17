"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/auth/client";
import { User } from "@supabase/supabase-js";
import { fetchUserData } from "@/data/userData";
import UserProfileComponent from "@/components/userProfile/userProfile";

export default function Home() {
  const [userData, setUserData] = useState<User | null>(null);
  useEffect(() => {
    const getUserData = async () => {
      const data = await fetchUserData();
      setUserData(data);
    };

    getUserData();
  }, []);
  return (
    <div>
       <UserProfileComponent />
    </div>

    // <IftarFinderPage/>
  );
}
