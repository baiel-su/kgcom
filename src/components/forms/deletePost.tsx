import { deletePostAction } from "@/actions/postActions";
import { toast } from "@/hooks/use-toast";
import { useTransition } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

type JoinPostFormProps = {
  postId: string;
  userId: string;
};

export const DeletePost = ({ postId, userId }: JoinPostFormProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDeletePost = () => {
    startTransition(async () => {
      const { success, message } = await deletePostAction(postId, userId);
      if (success) {
        // temporary use
        router.push("/ramadan/iftar");
        toast({
          title: "Success",
          description: "Successfully deleted the post",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Button
      onClick={handleDeletePost}
      variant="nothing"
      size={"nothing"}
      disabled={isPending}
    >
      Delete
    </Button>
  );
};
