import { signOutAction } from "@/actions/authActions";
import { addMyNameAction } from "@/actions/postActions";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/authContext";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";

const AddMyName = () => {
  const router = useRouter();
  const {user} = useAuth()

  const [isPending, startTransition] = useTransition();

  const handleClickSignOutButton = () => {
    startTransition(async () => {
    //   const { errorMessage } = await addMyNameAction(user?.id as string);
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
        if (typeof window !== "undefined") {
          window.location.reload();
        }
      }
    });
  };

  return (
    <div>
      <Button
        variant="outline"
        className="w-full mt-4"
        onClick={() => {
          handleClickSignOutButton;
        }}
      >
        Add My Name
      </Button>
    </div>
  );
};

export default AddMyName;
