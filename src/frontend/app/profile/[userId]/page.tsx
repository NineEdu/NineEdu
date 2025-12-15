import UserPublicProfile from "@/pages/User/Profile";
import PublicLayout from "@/shared/layouts/PublicLayout";
import React from "react";

const page = () => {
  return (
    <PublicLayout>
      <UserPublicProfile />
    </PublicLayout>
  );
};

export default page;
