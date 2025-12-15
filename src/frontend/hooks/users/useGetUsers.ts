// @ts-nocheck

import userApis from "@/shared/apis/userApis";
import { createUseQuery } from "@/utils/reactQuery";

// export query key
export const queryKey = ["admin-users"];

// export query function
export const queryFn = (params) => {
  return userApis.getUsers(params);
};

export default createUseQuery({ queryKey, queryFn });
