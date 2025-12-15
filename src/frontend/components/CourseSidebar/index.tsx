"use client";

import React from "react";
import { SidebarRoutes } from "../SidebarRoutes";
import useGetCourseById from "@/hooks/courses/useGetCourseById";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface CourseSidebarProps {
  courseId: string;
}

export const CourseSidebar = ({ courseId }: CourseSidebarProps) => {
  // fetch course data
  const { data: course, isLoading } = useGetCourseById({
    queryKey: ["course", courseId],
    queryParams: { courseId },
  });

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
      {/* header section */}
      <div className="p-6 flex flex-col items-center border-b mb-2">
        {isLoading ? (
          <div className="space-y-2 w-full">
            <Skeleton className="h-24 w-full rounded-md" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
          </div>
        ) : (
          <>
            <div className="relative aspect-[16/9] w-full mb-4 rounded-md overflow-hidden border border-slate-100 shadow-sm">
              {/* course thumbnail */}
              <img
                src={course?.thumbnail || "/placeholder.jpg"}
                alt="Course cover"
                className="object-cover w-full h-full"
              />
            </div>
            <h2 className="font-bold text-slate-800 text-center line-clamp-2 text-sm px-2">
              {course?.title || "Untitled Course"}
            </h2>

            {/* status badge */}
            <div className="mt-2">
              <Badge
                className={
                  course?.isPublished
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-yellow-500 hover:bg-yellow-600"
                }
              >
                {course?.isPublished ? "Published" : "Draft"}
              </Badge>
            </div>
          </>
        )}
      </div>

      {/* sidebar routes */}
      <div className="flex-1 w-full mt-2">
        <SidebarRoutes courseId={courseId} />
      </div>
    </div>
  );
};
