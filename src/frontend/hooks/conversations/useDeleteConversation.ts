import { notifyError, notifySuccess } from "@/components/Notify";
import conversationApis from "@/shared/apis/conversationApis";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKey as getConversationsKey } from "./useGetConversations";

type DeleteParams = {
  conversationId: string;
};

const mutationFn = async (params: DeleteParams) => {
  return await conversationApis.deleteConversation(params);
};

// @ts-ignore
const useDeleteConversation = (mutationOptions) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({ mutationFn, ...mutationOptions });

  const deleteConversation = async ({ conversationId }: DeleteParams) => {
    try {
      // @ts-ignore
      const res = await mutation.mutateAsync({ conversationId });
      notifySuccess("Deleted successfully");
      queryClient.invalidateQueries({ queryKey: getConversationsKey });
      return res;
    } catch (error) {
      notifyError(error);
      return error;
    }
  };

  return { deleteConversation, ...mutation };
};

export default useDeleteConversation;
