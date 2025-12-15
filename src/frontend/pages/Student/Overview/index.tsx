"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle,
  PlayCircle,
  Trophy,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useCurrentUser } from "@/hooks/useAuth";
import useGetMyCourses from "@/hooks/courses/useGetMyCourse";

export default function StudentDashboard() {
  // fetch user info
  const { data: user, isLoading: isUserLoading } = useCurrentUser();

  // fetch courses
  const { data: enrollments, isLoading: isCoursesLoading } = useGetMyCourses();

  const isLoading = isUserLoading || isCoursesLoading;

  // process stats
  const courseList = Array.isArray(enrollments) ? enrollments : [];

  const inProgressCourses = courseList.filter(
    (item) => item.status !== "completed"
  );
  const completedCourses = courseList.filter(
    (item) => item.status === "completed"
  );

  // get latest active course
  const currentCourse =
    inProgressCourses.length > 0 ? inProgressCourses[0] : null;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* header section */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 p-8 shadow-lg">
        {/* background decoration */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user?.fullName || "Student"}! 👋
            </h1>
            <p className="text-indigo-100 max-w-xl">
              You have made great progress this week. Keep it up and finish your
              course to get the certificate.
            </p>
          </div>
          {/* user avatar */}
          <div className="hidden md:block">
            <div className="w-16 h-16 rounded-full border-4 border-white/30 overflow-hidden bg-white/10">
              <img
                src={user?.avatar || "/default-avatar.png"}
                alt="User"
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={BookOpen}
          label="In Progress"
          value={inProgressCourses.length}
          colorClass="text-blue-600 bg-blue-50"
          borderColor="border-blue-100"
        />

        <StatCard
          icon={CheckCircle}
          label="Completed"
          value={completedCourses.length}
          colorClass="text-green-600 bg-green-50"
          borderColor="border-green-100"
        />

        <StatCard
          icon={Trophy}
          label="Certificates Earned"
          value={completedCourses.length}
          colorClass="text-yellow-600 bg-yellow-50"
          borderColor="border-yellow-100"
        />
      </div>

      {/* main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* left col: continue learning */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Pick up where you left off
            </h2>
            <Link
              href="/student/courses"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              View all courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {currentCourse ? (
            <div className="bg-white border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-center">
              {/* thumbnail */}
              <div className="w-full md:w-1/2 aspect-video rounded-xl overflow-hidden relative group">
                <img
                  src={currentCourse.courseId.thumbnail || "/placeholder.jpg"}
                  alt={currentCourse.courseId.title}
                  className="object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <PlayCircle className="w-12 h-12 text-white opacity-90" />
                </div>
              </div>

              {/* info */}
              <div className="flex-1 w-full space-y-4">
                <div>
                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                    In Progress
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mt-2 line-clamp-2">
                    {currentCourse.courseId.title}
                  </h3>
                </div>

                {/* progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Progress</span>
                    <span className="font-medium text-gray-900">
                      {currentCourse.progress}%
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${currentCourse.progress}%` }}
                    ></div>
                  </div>
                </div>

                <Link href={`/courses/${currentCourse.courseId._id}/learn`}>
                  <Button className="w-full mt-2">Continue Learning</Button>
                </Link>
              </div>
            </div>
          ) : (
            // empty state
            <div className="bg-white border rounded-2xl p-8 text-center shadow-sm">
              <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                No courses in progress
              </h3>
              <p className="text-gray-500 mb-6">
                Explore our catalog and start learning today!
              </p>
              <Link href="/courses">
                <Button>Explore Courses</Button>
              </Link>
            </div>
          )}
        </div>

        {/* right col: recent activity */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Completed</h2>

          <div className="bg-white border rounded-2xl p-4 shadow-sm flex flex-col gap-4">
            {completedCourses.length > 0 ? (
              completedCourses.slice(0, 3).map((course) => (
                <div
                  key={course._id}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-gray-100 relative overflow-hidden flex-shrink-0">
                    <img
                      src={course.courseId.thumbnail}
                      alt=""
                      className="object-cover w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                      {course.courseId.title}
                    </h4>
                    <div className="flex items-center gap-1 text-xs text-green-600 mt-0.5">
                      <CheckCircle className="w-3 h-3" />
                      <span>Completed</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-gray-500">
                  No completed courses yet.
                </p>
              </div>
            )}

            {completedCourses.length > 0 && (
              <Link href="/student/certificates">
                <Button variant="outline" className="w-full text-xs">
                  View All Certificates
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// stat card component
const StatCard = ({
  icon: Icon,
  label,
  value,
  colorClass,
  borderColor,
}: any) => {
  return (
    <div
      className={`bg-white p-6 rounded-2xl border ${borderColor} shadow-sm flex items-center justify-between`}
    >
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};

// loading skeleton
const DashboardSkeleton = () => (
  <div className="space-y-8">
    <Skeleton className="h-48 w-full rounded-2xl" />
    <div className="grid grid-cols-3 gap-6">
      <Skeleton className="h-28 rounded-2xl" />
      <Skeleton className="h-28 rounded-2xl" />
      <Skeleton className="h-28 rounded-2xl" />
    </div>
    <div className="grid grid-cols-3 gap-8">
      <Skeleton className="col-span-2 h-64 rounded-2xl" />
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  </div>
);
