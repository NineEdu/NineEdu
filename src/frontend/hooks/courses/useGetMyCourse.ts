// @ts-nocheck
import enrollmentApis from "@/shared/apis/enrollmentApis";
import { createUseQuery } from "@/utils/reactQuery";

export const queryKey = ["getCourseStats"];

export const queryFn = () => {
  return enrollmentApis.getMyCourses();
};

export default createUseQuery({ queryKey, queryFn });
