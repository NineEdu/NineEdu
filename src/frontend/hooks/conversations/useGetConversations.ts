// @ts-nocheck
import conversationApis from "@/shared/apis/conversationApis";
import { createUseQuery } from "@/utils/reactQuery";

// export query key
export const queryKey = ["getConversations"];

// export query function
export const queryFn = (params: { courseId: string; lessonId?: string }) => {
  return conversationApis.getConversations(params);
};

export default createUseQuery({ queryKey, queryFn });
