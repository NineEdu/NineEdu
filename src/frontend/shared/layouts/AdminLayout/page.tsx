import React from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminHeader } from "@/components/AdminHeader"; 

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      <div className="hidden md:block w-[280px] shrink-0 border-r bg-white dark:bg-slate-950">
        <AdminSidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
