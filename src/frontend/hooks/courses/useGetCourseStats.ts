// @ts-nocheck
import courseApis from "@/shared/apis/courseApis";
import { createUseQuery } from "@/utils/reactQuery";

export const queryKey = ["getCourseStats"];

export const queryFn = () => {
  return courseApis.getCourseStats();
};

export default createUseQuery({ queryKey, queryFn });
