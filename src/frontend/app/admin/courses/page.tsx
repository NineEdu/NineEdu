import ManageCourses from "@/pages/Admin/Courses";
import AdminLayout from "@/shared/layouts/AdminLayout/page";
import React from "react";

const page = () => {
  return (
    <div>
      <AdminLayout>
        <ManageCourses />
      </AdminLayout>
    </div>
  );
};

export default page;
