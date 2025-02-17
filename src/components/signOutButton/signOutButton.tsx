"use client";

import { signOutAction } from "@/actions/authActions";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

function SignOutButton() {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const handleClickSignOutButton = () => {
    startTransition(async () => {
      const { errorMessage } = await signOutAction();
      if (errorMessage) {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Successfully signed out",
          variant: "default",
        });
        router.push("/");
        // temporary use
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
    
      }
    });
  };

  return (
    <button
      onClick={handleClickSignOutButton}
      className=" "
      disabled={isPending}
    >
      {isPending ? <Loader2 className="animate-spin" /> : "Sign Out"}
    </button>
  );
}

export default SignOutButton;
