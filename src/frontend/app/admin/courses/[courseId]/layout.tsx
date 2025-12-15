"use client";

import { CourseNavbar } from "@/components/CourseNavbar";
import { CourseSidebar } from "@/components/CourseSidebar";
import { useParams } from "next/navigation";

import React from "react";

export default function CourseDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-64 fixed inset-y-0 w-full z-50">
        <CourseNavbar />
      </div>

      <div className="hidden md:flex h-full w-64 flex-col fixed inset-y-0 z-50">
        <CourseSidebar courseId={params?.courseId as string} />
      </div>

      <main className="md:pl-64 pt-[80px] h-full bg-slate-50/50">
        <div className="p-6 h-full">{children}</div>
      </main>
    </div>
  );
}
