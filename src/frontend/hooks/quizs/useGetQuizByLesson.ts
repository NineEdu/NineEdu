// @ts-nocheck

import quizApis from "@/shared/apis/quizApis";
import { createUseQuery } from "@/utils/reactQuery";

// export query key
export const queryKey = ["getQuizDetails"];

// export query function
export const queryFn = (params) => {
  return quizApis.getQuizByLesson(params);
};

export default createUseQuery({ queryKey, queryFn });
