import { notifyError, notifySuccess } from "@/components/Notify";
import conversationApis from "@/shared/apis/conversationApis";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKey as getConversationsKey } from "./useGetConversations";

type CreateConversationParams = {
  courseId: string;
  lessonId?: string;
  title?: string;
  content: string;
};

const mutationFn = async (params: CreateConversationParams) => {
  return await conversationApis.createConversation(params);
};

// @ts-ignore
const useCreateConversation = (mutationOptions) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({ mutationFn, ...mutationOptions });

  const createConversation = async ({
    courseId,
    lessonId,
    title,
    content,
  }: CreateConversationParams) => {
    try {
      // @ts-ignore
      const res = await mutation.mutateAsync({
        courseId,
        lessonId,
        title,
        content,
      });
      notifySuccess("Posted successfully");
      queryClient.invalidateQueries({ queryKey: getConversationsKey });
      return res;
    } catch (error) {
      notifyError(error);
      return error;
    }
  };

  return { createConversation, ...mutation };
};

export default useCreateConversation;
