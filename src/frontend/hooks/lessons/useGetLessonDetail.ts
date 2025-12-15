// @ts-nocheck

import lessonApis from "@/shared/apis/lessonApis";
import { createUseQuery } from "@/utils/reactQuery";

// export query key
export const queryKey = ["getLessonDetail", "get-lesson-detail"];

// export query function
export const queryFn = (queryParams) => {
  return lessonApis.getLessonDetail(queryParams);
};

export default createUseQuery({ queryKey, queryFn });
