import ManageUsersPage from "@/pages/Admin/Users";
import AdminLayout from "@/shared/layouts/AdminLayout/page";
import React from "react";

const page = () => {
  return (
    <AdminLayout>
      <ManageUsersPage />
    </AdminLayout>
  );
};

export default page;
