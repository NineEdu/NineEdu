// @ts-nocheck

import lessonApis from "@/shared/apis/lessonApis";
import { createUseQuery } from "@/utils/reactQuery";

// export query key
export const queryKey = ["getLessonByCourses", "get-lesson-by-courses"];

// export query function
export const queryFn = (queryParams) => {
  return lessonApis.getLessonsByCourse(queryParams);
};

export default createUseQuery({ queryKey, queryFn });
