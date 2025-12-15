// @ts-nocheck
import { GET } from "@/shared/apis/fetch";
import { createUseQuery } from "@/utils/reactQuery";

const getPublicUser = (userId: string) => {
  return GET(`/users/public/${userId}`);
};

export const queryKey = ["public-user-profile"];

export const queryFn = (params: any) => {
  return getPublicUser(params.userId);
};

export default createUseQuery({ queryKey, queryFn });
