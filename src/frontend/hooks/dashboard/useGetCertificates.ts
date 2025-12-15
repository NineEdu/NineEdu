// @ts-nocheck

import dashboardApis from "@/shared/apis/dashboardApis";
import { createUseQuery } from "@/utils/reactQuery";

// export query key
export const queryKey = ["getCertificates"];

// export query function
export const queryFn = (params) => {
  return dashboardApis.getCertificates(params);
};

export default createUseQuery({ queryKey, queryFn });
