"use client";

import React from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, PlayCircle, CheckCircle, Clock } from "lucide-react";

import useGetMyCourses from "@/hooks/courses/useGetMyCourse";

// types
interface CourseInfo {
  _id: string;
  title: string;
  thumbnail: string;
  instructorId: string;
}

interface Enrollment {
  _id: string;
  userId: string;
  courseId: CourseInfo; // populated
  status: "in-progress" | "completed";
  progress: number;
}

export default function StudentCoursesPage() {
  // fetch data
  const { data: enrollments, isLoading } = useGetMyCourses();

  // loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // safe data
  const courseList: Enrollment[] = Array.isArray(enrollments)
    ? enrollments
    : [];

  // filter data
  const inProgressList = courseList.filter(
    (item) => item.courseId && item.status !== "completed"
  );

  const completedList = courseList.filter(
    (item) => item.courseId && item.status === "completed"
  );

  return (
    <div className="space-y-6">
      {/* header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Learning</h1>
        <p className="text-slate-500">
          Manage your courses and track progress.
        </p>
      </div>

      {/* tabs */}
      <Tabs defaultValue="inprogress" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="inprogress">
            In Progress ({inProgressList.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedList.length})
          </TabsTrigger>
        </TabsList>

        {/* in progress tab */}
        <TabsContent value="inprogress" className="mt-6">
          {inProgressList.length === 0 ? (
            <EmptyState message="You are not studying any courses." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressList.map((item) => (
                <CourseCard key={item._id} data={item} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* completed tab */}
        <TabsContent value="completed" className="mt-6">
          {completedList.length === 0 ? (
            <EmptyState message="You haven't completed any courses yet." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedList.map((item) => (
                <CourseCard key={item._id} data={item} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// course card component
const CourseCard = ({ data }: { data: Enrollment }) => {
  const { courseId, progress, status } = data;
  const isCompleted = status === "completed";

  // thumbnail url
  const thumbnailUrl = courseId.thumbnail || "/placeholder-course.jpg";

  // learn link
  const learnLink = `/courses/${courseId._id}/learn`;

  return (
    <div className="group flex flex-col bg-white border rounded-xl overflow-hidden hover:shadow-md transition-all h-full">
      {/* image section */}
      <div className="relative w-full aspect-video overflow-hidden bg-slate-100">
        <img
          src={thumbnailUrl}
          alt={courseId.title}
          className="object-cover w-full group-hover:scale-105 transition-transform duration-300"
        />
        {/* overlay icon */}
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          {!isCompleted ? (
            <PlayCircle className="w-12 h-12 text-white" />
          ) : (
            <CheckCircle className="w-12 h-12 text-green-400" />
          )}
        </div>
      </div>

      {/* content section */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-lg line-clamp-2 mb-2 group-hover:text-indigo-700 transition-colors">
          {courseId.title}
        </h3>

        <div className="mt-auto space-y-3">
          {/* progress bar & status */}
          {!isCompleted ? (
            <>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Progress</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          ) : (
            <div className="flex items-center text-green-600 text-sm font-medium gap-2 mb-4">
              <CheckCircle className="w-4 h-4" />
              <span>Completed</span>
            </div>
          )}

          {/* action button */}
          <Link href={learnLink} className="block mt-4">
            <Button
              className={`w-full ${
                !isCompleted
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                  : "border-indigo-200 text-indigo-700 hover:bg-indigo-50"
              }`}
              variant={!isCompleted ? "default" : "outline"}
            >
              {!isCompleted ? "Continue Learning" : "Review Course"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

// empty state component
const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-xl bg-slate-50">
    <div className="bg-white p-4 rounded-full mb-3 shadow-sm">
      <Clock className="w-8 h-8 text-slate-400" />
    </div>
    <p className="text-slate-500 max-w-sm mb-4">{message}</p>
    <Link href="/courses">
      <Button variant="link" className="text-indigo-600 font-semibold">
        Browse Courses
      </Button>
    </Link>
  </div>
);
