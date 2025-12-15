// @ts-nocheck
import dashboardApis from "@/shared/apis/dashboardApis";
import { createUseQuery } from "@/utils/reactQuery";

export const queryKey = ["admin-stats"];

export const queryFn = () => {
  return dashboardApis.getAdminStats();
};

export default createUseQuery({ queryKey, queryFn });
