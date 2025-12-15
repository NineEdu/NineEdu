// @ts-nocheck

import courseApis from "@/shared/apis/courseApis";
import { createUseQuery } from "@/utils/reactQuery";

// export query key
export const queryKey = ["getCourses", "get-courses"];

// export query function
export const queryFn = (queryParams) => {
  return courseApis.getCourseById(queryParams);
};

export default createUseQuery({ queryKey, queryFn });
