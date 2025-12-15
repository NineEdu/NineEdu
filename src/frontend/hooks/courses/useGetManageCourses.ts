// @ts-nocheck
import courseApis from "@/shared/apis/courseApis";
import { createUseQuery } from "@/utils/reactQuery";

export const queryKey = ["getManageCourses"];

export const queryFn = (queryParams) => {
  return courseApis.getManageCourses(queryParams);
};

export default createUseQuery({ queryKey, queryFn });
