"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";

// hooks
import useGetCourseById from "@/hooks/courses/useGetCourseById";
import CourseForm from "@/pages/Courses/Create";

export default function SettingsPage() {
  const params = useParams();
  const courseId = params?.courseId as string;

  // fetch current course data
  const {
    data: course,
    isLoading,
    isError,
  } = useGetCourseById({
    queryKey: ["course", courseId],
    queryParams: { courseId },
  });

  // loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#020080]" />
        <p className="font-medium">Loading settings...</p>
      </div>
    );
  }

  // error state
  if (isError || !course) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-red-500">
        <div className="bg-red-50 p-4 rounded-full mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">
          Failed to load data
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Please check your connection or try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* reuse create form for editing */}
      <CourseForm initialData={course} />
    </div>
  );
}
