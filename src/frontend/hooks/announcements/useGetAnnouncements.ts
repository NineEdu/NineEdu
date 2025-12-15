// @ts-nocheck

import announcementApis from "@/shared/apis/announcementApis";
import { createUseQuery } from "@/utils/reactQuery";

// export query key
export const queryKey = ["getAnnouncements"];

// export query function
export const queryFn = (params) => {
  return announcementApis.getAnnouncements(params);
};

export default createUseQuery({ queryKey, queryFn });
