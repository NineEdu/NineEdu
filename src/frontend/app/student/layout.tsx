"use client";

import React from "react";
import { Navbar } from "@/shared/components/Navbar";
import { Sidebar } from "@/components/StudentSidebar";
import { Menu } from "lucide-react";

// shadcn components
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const StudentLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* navbar (fixed top) */}
      <Navbar />

      {/* main wrapper (padded for navbar height) */}
      <div className="pt-[65px] flex flex-1 h-full relative">
        {/* desktop sidebar */}
        <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 left-0 top-[65px] z-40 border-r bg-white h-[calc(100vh-65px)]">
          <Sidebar />
        </aside>

        {/* mobile header & drawer trigger */}
        <div className="md:hidden w-full bg-white border-b px-4 py-3 flex items-center justify-between sticky top-[65px] z-30 shadow-sm">
          <span className="font-semibold text-gray-700">Student Dashboard</span>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                <Menu className="w-5 h-5 text-gray-600" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <Sidebar />
            </SheetContent>
          </Sheet>
        </div>

        {/* main content */}
        <main className="flex-1 w-full md:pl-64 transition-all duration-300">
          <div className="p-4 md:p-8 h-full">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
