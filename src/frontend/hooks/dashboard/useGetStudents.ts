// @ts-nocheck

import dashboardApis from "@/shared/apis/dashboardApis";
import { createUseQuery } from "@/utils/reactQuery";

// export query key
export const queryKey = ["getStudents"];

// export query function
export const queryFn = (params) => {
  return dashboardApis.getStudents(params);
};

export default createUseQuery({ queryKey, queryFn });
