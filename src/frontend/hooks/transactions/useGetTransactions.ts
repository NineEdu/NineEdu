// @ts-nocheck

import transactionApis from "@/shared/apis/transactionApis";
import { createUseQuery } from "@/utils/reactQuery";

// export query key
export const queryKey = ["admin-transactions"];

// export query function
export const queryFn = (params) => {
  return transactionApis.getTransactions(params);
};

export default createUseQuery({ queryKey, queryFn });
