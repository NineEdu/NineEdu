import { notifyError, notifySuccess } from "@/components/Notify";
import conversationApis from "@/shared/apis/conversationApis";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKey as getConversationsKey } from "./useGetConversations";

type ReplyParams = {
  conversationId: string;
  content: string;
};

const mutationFn = async (params: ReplyParams) => {
  return await conversationApis.replyConversation(params);
};

// @ts-ignore
const useReplyConversation = (mutationOptions) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({ mutationFn, ...mutationOptions });

  const replyConversation = async ({
    conversationId,
    content,
  }: ReplyParams) => {
    try {
      // @ts-ignore
      const res = await mutation.mutateAsync({
        conversationId,
        content,
      });
      notifySuccess("Reply added");
      queryClient.invalidateQueries({ queryKey: getConversationsKey });
      return res;
    } catch (error) {
      notifyError(error);
      return error;
    }
  };

  return { replyConversation, ...mutation };
};

export default useReplyConversation;
