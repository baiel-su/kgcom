import { deleteMyNameAction } from "@/actions/postActions";
import { toast } from "@/hooks/use-toast";
import { useTransition } from "react";
import { Button } from "../ui/button";

interface IDeleteMyNameProps {
  postId: string;
}

const DeleteMyName = ({ postId }: IDeleteMyNameProps) => {
  const [isPending, startTransition] = useTransition();
  const onSubmit = () => {
    startTransition(async () => {
      const { success, message } = await deleteMyNameAction(postId);
      if (success) {
        // temporary use
        if (typeof window !== "undefined") {
          window.location.reload();
        }
        toast({
          title: "Success",
          description: "Successfully joined the post",
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
    <div>
      <Button onClick={onSubmit} disabled={isPending} variant="nothing"  size={'nothing'}>
        Delete
      </Button>
    </div>
  );
};

export default DeleteMyName;
