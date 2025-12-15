// @ts-nocheck

import dashboardApis from "@/shared/apis/dashboardApis";
import { createUseQuery } from "@/utils/reactQuery";

// export query key
export const queryKey = ["getCourseStats"];

// export query function
export const queryFn = (params) => {
  return dashboardApis.getCourseStats(params);
};

export default createUseQuery({ queryKey, queryFn });
