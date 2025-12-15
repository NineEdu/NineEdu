"use client";

import React from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Users,
  BookOpen,
  Star,
  DollarSign,
  MoreVertical,
  ExternalLink,
  Edit,
  Video,
  Settings,
  TrendingUp,
  CreditCard,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

// hooks
import useGetCourseById from "@/hooks/courses/useGetCourseById";
import useGetCourseStats from "@/hooks/dashboard/useGetCourseStats";
import useGetStudents from "@/hooks/dashboard/useGetStudents";
import formatCurrency from "@/utils/formatCurrency";
import formatDate from "@/utils/formatData";

export default function CourseDashboardPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.courseId as string;

  // fetch data
  const { data: course, isLoading: loadingCourse } = useGetCourseById({
    queryKey: ["course", courseId],
    queryParams: { courseId },
  });

  const { data: stats, isLoading: loadingStats } = useGetCourseStats({
    queryParams: { courseId },
  });

  const { data: recentStudents = [], isLoading: loadingStudents } =
    useGetStudents({
      queryParams: { courseId, limit: 5 },
    });

  if (loadingCourse || loadingStats) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6">
      {/* top navigation & actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 truncate max-w-md">
                {course?.title}
              </h1>
              <Badge
                variant={course?.isPublished ? "default" : "secondary"}
                className={
                  course?.isPublished
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-slate-200 text-slate-600"
                }
              >
                {course?.isPublished ? "Published" : "Draft"}
              </Badge>
            </div>
            <p className="text-sm text-slate-500 font-medium">
              Course Overview & Performance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild className="bg-white">
            <Link href={`/courses/${courseId}`} target="_blank">
              <ExternalLink className="mr-2 h-4 w-4" />
              Preview
            </Link>
          </Button>
          <Button
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 shadow-sm"
            asChild
          >
            <Link href={`/admin/courses/${courseId}/settings`}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* kpi cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Total Revenue"
            value={formatCurrency(stats?.totalRevenue || 0)}
            icon={DollarSign}
            color="text-green-600"
            bg="bg-green-50"
          />
          <KpiCard
            title="Students"
            value={stats?.totalStudents || 0}
            icon={Users}
            color="text-blue-600"
            bg="bg-blue-50"
          />
          <KpiCard
            title="Rating"
            value={stats?.rating || "N/A"}
            icon={Star}
            color="text-yellow-600"
            bg="bg-yellow-50"
          />
          <KpiCard
            title="Lessons"
            value={stats?.lessonsCount || 0}
            icon={BookOpen}
            color="text-indigo-600"
            bg="bg-indigo-50"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* left column: main analytics (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* revenue chart placeholder */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Revenue Analytics</CardTitle>
                <CardDescription>
                  Performance over the last 30 days
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center bg-slate-50/50 m-6 rounded-lg border border-dashed">
                <div className="text-center text-slate-400">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Chart visualization would go here</p>
                </div>
              </CardContent>
            </Card>

            {/* recent enrollments */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Recent Enrollments</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-indigo-600"
                >
                  <Link href={`/admin/courses/${courseId}/students`}>
                    View All
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loadingStudents ? (
                    <div className="space-y-3">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ) : recentStudents.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-sm">
                      No students yet.
                    </div>
                  ) : (
                    recentStudents.map((student: any) => (
                      <div
                        key={student.enrollmentId}
                        className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border">
                            <AvatarImage src={student.avatar} />
                            <AvatarFallback className="bg-indigo-50 text-indigo-700 text-xs">
                              {student.name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {student.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {student.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-slate-500">
                            {formatDate(student.joinedAt)}
                          </span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreVertical className="h-4 w-4 text-slate-400" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Email Student</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* right column: sidebar info (1/3) */}
          <div className="space-y-6">
            {/* course info card */}
            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <div className="relative aspect-video w-full bg-slate-100">
                {course?.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt="Thumbnail"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">
                    <Video className="h-10 w-10" />
                  </div>
                )}
              </div>
              <CardContent className="p-5 space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Course Status
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {course?.isPublished
                      ? "This course is live and visible to students."
                      : "This course is unpublished and hidden."}
                  </p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500 text-xs uppercase font-bold">
                      Price
                    </p>
                    <p className="font-medium mt-1">
                      {course?.isFree
                        ? "Free"
                        : formatCurrency(course?.price || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs uppercase font-bold">
                      Category
                    </p>
                    <p className="font-medium mt-1 truncate">
                      {course?.category || "Uncategorized"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* quick actions */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Button
                  variant="outline"
                  className="justify-start h-10"
                  asChild
                >
                  <Link href={`/admin/courses/${courseId}/curriculum`}>
                    <Video className="mr-2 h-4 w-4 text-indigo-600" />
                    Manage Curriculum
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start h-10"
                  asChild
                >
                  <Link href={`/admin/courses/${courseId}/settings`}>
                    <Edit className="mr-2 h-4 w-4 text-blue-600" />
                    Edit Details
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start h-10 text-slate-400 cursor-not-allowed"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Coupons (Coming soon)
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// sub-components
function KpiCard({ title, value, icon: Icon, color, bg }: any) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        </div>
        <div
          className={`h-10 w-10 rounded-full flex items-center justify-center ${bg} ${color}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between">
        <Skeleton className="h-10 w-64" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-8">
        <Skeleton className="col-span-2 h-96" />
        <Skeleton className="col-span-1 h-96" />
      </div>
    </div>
  );
}
