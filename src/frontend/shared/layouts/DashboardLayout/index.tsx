import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Navbar } from "@/shared/components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Navbar />
      <div className="flex w-full min-h-screen pt-[70px] bg-gray-50">
        <AppSidebar />

        <main className="flex-1 p-6 overflow-y-auto">
          <SidebarTrigger />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
