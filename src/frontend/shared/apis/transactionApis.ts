// @ts-nocheck
import { GET } from "./fetch";

const transactionApis = {
  // Lấy danh sách giao dịch (có lọc)
  getTransactions: ({ page, limit, search, status }) => {
    const params = new URLSearchParams();
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);
    if (search) params.append("search", search);
    if (status && status !== "all") params.append("status", status);

    return GET(`/transactions?${params.toString()}`);
  },
};

export default transactionApis;
