"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Play,
  CheckCircle,
  BarChart,
  Clock,
  FileText,
  Trophy,
  ArrowRight,
  MessageCircle,
  Users,
  Loader2,
  Award,
} from "lucide-react";

import useGetCourseById from "@/hooks/courses/useGetCourseById";
import useGetLessonsByCourse from "@/hooks/lessons/useGetLessonsByCourse";
import {
  useGetMyCertificates,
  useIssueCertificate,
} from "@/hooks/certificates/useCertificateHooks";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import formatDuration from "@/utils/formatDuration";

export default function CourseWelcomePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.courseId as string;

  // fetch course and lessons
  const { data: course, isLoading: isCourseLoading } = useGetCourseById({
    queryKey: ["getCourseById", courseId],
    queryParams: { courseId },
  });

  const { data: lessons = [], isLoading: isLessonsLoading } =
    useGetLessonsByCourse({
      queryKey: ["getLessonsByCourse", courseId],
      queryParams: { courseId },
    });

  // certificate hooks
  const { data: myCertificates } = useGetMyCertificates({});
  const { mutate: issueCertificate, isPending: isIssuing } =
    useIssueCertificate();

  // check existing certificate
  const existingCertificate = useMemo(() => {
    if (!myCertificates || !courseId) return null;
    return myCertificates.find(
      (cert: any) => (cert.courseId._id || cert.courseId) === courseId
    );
  }, [myCertificates, courseId]);

  // claim certificate handler
  const handleClaimCertificate = () => {
    issueCertificate(
      { courseId },
      {
        onSuccess: (data) => {
          router.push(`/certificates/${data.certificateCode}`);
        },
      }
    );
  };

  // view certificate handler
  const handleViewCertificate = () => {
    if (existingCertificate) {
      router.push(`/certificates/${existingCertificate.certificateCode}`);
    }
  };

  // calculate stats
  const stats = useMemo(() => {
    if (!lessons.length)
      return { progress: 0, completed: 0, total: 0, nextLessonId: null };

    const total = lessons.length;
    const completed = lessons.filter((l: any) => l.isCompleted).length;
    const progress = Math.round((completed / total) * 100);

    const nextLesson =
      lessons.find((l: any) => !l.isCompleted) || lessons[lessons.length - 1];

    return {
      progress,
      completed,
      total,
      nextLesson,
      totalDuration: lessons.reduce(
        (acc: number, curr: any) => acc + (curr.duration || 0),
        0
      ),
    };
  }, [lessons]);

  const handleStart = () => {
    if (stats.nextLesson) {
      router.push(`/courses/${courseId}/${stats.nextLesson._id}`);
    }
  };

  const handleGoToConversations = () => {
    router.push(`/courses/${courseId}/conversations`);
  };

  if (isCourseLoading || isLessonsLoading) return <WelcomeSkeleton />;
  if (!course) return <div className="p-10 text-center">Course not found</div>;

  const isNewStudent = stats.progress === 0;
  const isCompleted = stats.progress === 100;

  // render certificate content based on status
  const renderCertificateContent = () => {
    if (!isCompleted) {
      return (
        <span className="text-lg font-bold text-slate-900">On completion</span>
      );
    }

    if (existingCertificate) {
      return (
        <div
          onClick={handleViewCertificate}
          className="group cursor-pointer flex flex-col items-center"
        >
          <span className="text-sm font-bold text-indigo-700 underline decoration-indigo-300 underline-offset-4 group-hover:text-indigo-800 transition-all flex items-center gap-1">
            View Certificate{" "}
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      );
    }

    return (
      <Button
        size="sm"
        variant="outline"
        onClick={handleClaimCertificate}
        disabled={isIssuing}
        className="h-8 text-xs font-bold border-green-600 text-green-700 hover:bg-green-50"
      >
        {isIssuing ? (
          <Loader2 className="w-3 h-3 animate-spin mr-1" />
        ) : (
          <Award className="w-3 h-3 mr-1" />
        )}
        {isIssuing ? "Issuing..." : "Claim Now"}
      </Button>
    );
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex justify-center ">
      <div className="max-w-7xl w-full space-y-8">
        {/* header section */}
        <div className="bg-white rounded-lg p-6 md:p-10 border flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 space-y-4 text-center md:text-left">
            <Badge
              variant={isCompleted ? "default" : "secondary"}
              className="mb-2 rounded-sm"
            >
              {isNewStudent
                ? "Start your journey"
                : isCompleted
                ? "Course Completed"
                : "Welcome Back"}
            </Badge>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
              {isNewStudent
                ? `Welcome to ${course.title}`
                : `Continue learning ${course.title}`}
            </h1>

            <p className="text-slate-500 text-lg line-clamp-2">
              {isNewStudent
                ? "Ready to master new skills? Let's dive into the first lesson."
                : `You are doing great! You have completed ${stats.completed} out of ${stats.total} lessons.`}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Button
                size="lg"
                onClick={handleStart}
                className="bg-indigo-600 hover:bg-indigo-700 text-base px-8 h-12 rounded-sm"
              >
                {isNewStudent ? (
                  <>
                    <Play className="mr-2 h-5 w-5 fill-current" /> Start
                    Learning
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-5 w-5 fill-current" /> Resume
                  </>
                )}
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={handleGoToConversations}
                className="h-12 px-6 border-slate-300 hover:bg-slate-50 text-slate-700 rounded-sm"
              >
                <MessageCircle className="mr-2 h-5 w-5" /> Discussion Forum
              </Button>
            </div>
          </div>

          {/* progress circle */}
          <div className="shrink-0 relative w-full md:w-64 aspect-video md:aspect-square rounded-lg overflow-hidden border">
            {!isNewStudent ? (
              <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-6 text-center">
                <div className="relative h-32 w-32 flex items-center justify-center mb-4">
                  <svg className="transform -rotate-90 w-full h-full">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      className="text-slate-100"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray={351}
                      strokeDashoffset={351 - (351 * stats.progress) / 100}
                      className={
                        isCompleted
                          ? "text-green-500"
                          : "text-indigo-600 transition-all duration-1000 ease-out"
                      }
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-3xl font-bold">
                      {stats.progress}%
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  Overall Progress
                </p>
              </div>
            ) : (
              <img
                src={course?.thumbnail || "/placeholder-course.jpg"}
                alt={course.title}
                className="object-cover w-full h-full"
              />
            )}
          </div>
        </div>

        {/* stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={BarChart}
            label="Level"
            value={course.level || "Beginner"}
          />
          <StatCard
            icon={Clock}
            label="Duration"
            value={formatTotalDuration(stats.totalDuration)}
          />
          <StatCard
            icon={FileText}
            label="Lessons"
            value={`${stats.total} videos`}
          />

          <StatCard
            icon={Trophy}
            label="Certificate"
            value={renderCertificateContent()}
            highlight={isCompleted}
          />
        </div>

        {/* community banner */}
        <div
          onClick={handleGoToConversations}
          className="bg-indigo-600 rounded-lg p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 cursor-pointer hover:bg-indigo-700 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Join the Class Community</h3>
              <p className="text-indigo-100">
                Ask questions, share ideas, and connect with other students.
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            className="whitespace-nowrap font-semibold rounded-sm"
          >
            Go to Discussions <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        {/* up next section */}
        {!isNewStudent && !isCompleted && stats.nextLesson && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Up Next</h2>
            <div
              onClick={handleStart}
              className="group flex items-center gap-4 bg-white p-4 rounded-lg border hover:border-indigo-300 transition-all cursor-pointer"
            >
              <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                <Play className="h-5 w-5 fill-current" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
                  Lesson{" "}
                  {lessons.findIndex(
                    (l: any) => l._id === stats.nextLesson._id
                  ) + 1}
                </p>
                <h3 className="font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">
                  {stats.nextLesson.title}
                </h3>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-indigo-500" />
            </div>
          </div>
        )}

        {/* course overview list */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Course Overview</h2>
          <Card className="rounded-lg border">
            <CardContent className="p-0 divide-y">
              {lessons.slice(0, 5).map((lesson: any, idx: number) => (
                <div
                  key={lesson._id}
                  className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="shrink-0">
                    {lesson.isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full border bg-slate-100 text-[10px] text-muted-foreground">
                        {idx + 1}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 text-sm font-medium text-slate-700">
                    {lesson.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDuration(lesson.duration)}
                  </div>
                </div>
              ))}
              {lessons.length > 5 && (
                <div
                  className="p-3 text-center text-sm text-indigo-600 font-medium cursor-pointer hover:underline"
                  onClick={handleStart}
                >
                  View all {lessons.length} lessons inside
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// stat card component
const StatCard = ({ icon: Icon, label, value, highlight }: any) => (
  <div
    className={`bg-white p-4 rounded-lg border flex flex-col items-center justify-center text-center gap-2 h-full min-h-[120px] ${
      highlight ? "border-green-200 bg-green-50" : "border-slate-200"
    }`}
  >
    <Icon
      className={`h-5 w-5 ${highlight ? "text-green-600" : "text-slate-400"}`}
    />
    <div className="flex flex-col items-center justify-center flex-1">
      <div className="text-lg font-bold text-slate-900 mb-1 flex items-center justify-center">
        {value}
      </div>
      <p className="text-xs text-muted-foreground font-medium uppercase">
        {label}
      </p>
    </div>
  </div>
);

// loading skeleton
const WelcomeSkeleton = () => (
  <div className="min-h-screen bg-slate-50 p-8 flex justify-center">
    <div className="max-w-4xl w-full space-y-6">
      <Skeleton className="h-64 w-full rounded-lg" />
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-40 w-full rounded-lg" />
    </div>
  </div>
);

// format duration helper
const formatTotalDuration = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};
