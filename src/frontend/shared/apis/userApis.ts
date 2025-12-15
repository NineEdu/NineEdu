// @ts-nocheck
import { GET, PUT, DELETE } from "./fetch";

const userApis = {
  // [Admin] Lấy danh sách users
  getUsers: ({ keyword, role, page, limit }) => {
    const params = new URLSearchParams();
    if (keyword) params.append("keyword", keyword);
    if (role && role !== "all") params.append("role", role);
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);

    return GET(`/users?${params.toString()}`);
  },

  // [Admin] Sửa user
  updateUser: ({ userId, data }) => {
    return PUT(`/users/${userId}`, { body: data });
  },

  // [Admin] Xóa user
  deleteUser: ({ userId }) => {
    return DELETE(`/users/${userId}`);
  },

  updateProfile: (data) => {
    return PUT("/users/profile", { body: data });
  },
  changePassword: (data) => {
    return PUT("/users/profile/password", { body: data });
  },
};

export default userApis;
