"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  FileText,
  Download,
  Link as LinkIcon,
  PlayCircle,
  CheckCircle,
  BrainCircuit,
} from "lucide-react";
import Link from "next/link";

import useGetLessonDetail from "@/hooks/lessons/useGetLessonDetail";
import useGetLessonsByCourse from "@/hooks/lessons/useGetLessonsByCourse";
import useCompleteLesson from "@/hooks/lessons/useCompleteLesson";
import useGetQuizByLesson from "@/hooks/quizs/useGetQuizByLesson";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import VideoPlayer from "@/components/VideoPlayer";
import QuizPlayer from "@/components/QuizPlayer";
import LessonCommentSection from "./LessonCommentSection";
import formatDuration from "@/utils/formatDuration";

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.courseId as string;
  const lessonId = params?.lessonId as string;

  // fetch lesson detail
  const { data: lesson, isLoading: isDetailLoading } = useGetLessonDetail({
    queryKey: ["getLessonDetail", lessonId],
    queryParams: { lessonId },
  });

  // fetch quiz for lesson
  const { data: quizData, isLoading: isQuizLoading } = useGetQuizByLesson({
    queryKey: ["getQuizByLesson", lessonId],
    queryParams: { lessonId },
  });

  // fetch lessons for sidebar
  const {
    data: lessons = [],
    isLoading: isListLoading,
    refetch: refetchLessons,
  } = useGetLessonsByCourse({
    queryKey: ["getLessonsByCourse", courseId],
    queryParams: { courseId },
  });

  // hook for completing lesson
  const { completeLesson } = useCompleteLesson();

  // view mode: 'video' | 'quiz'
  const [viewMode, setViewMode] = useState<"video" | "quiz">("video");

  // reset to video on lesson change
  useEffect(() => {
    setViewMode("video");
  }, [lessonId]);

  // navigation logic
  const nav = useMemo(() => {
    if (!lessons.length || !lessonId) return { prev: null, next: null };
    const idx = lessons.findIndex((l: any) => l._id === lessonId);
    return {
      prev: idx > 0 ? lessons[idx - 1]._id : null,
      next: idx < lessons.length - 1 ? lessons[idx + 1]._id : null,
    };
  }, [lessons, lessonId]);

  const progressPercentage = useMemo(() => {
    if (!lessons.length) return 0;
    const completedCount = lessons.filter((l: any) => l.isCompleted).length;
    return Math.round((completedCount / lessons.length) * 100);
  }, [lessons]);

  // handlers

  // video ended handler
  const handleVideoEnded = async () => {
    if (!courseId || !lessonId) return;

    if (quizData) {
      setViewMode("quiz");
    } else {
      const currentLesson = lessons.find((l: any) => l._id === lessonId);
      if (!currentLesson?.isCompleted) {
        await completeLesson({ courseId, lessonId });
        refetchLessons();
      }
    }
  };

  // quiz passed handler
  const handleQuizPassed = async () => {
    const currentLesson = lessons.find((l: any) => l._id === lessonId);
    if (!currentLesson?.isCompleted) {
      await completeLesson({ courseId, lessonId });
      refetchLessons();
    }
  };

  const handleNav = (id: string) => router.push(`/courses/${courseId}/${id}`);

  if (isDetailLoading) return <LessonSkeleton />;
  if (!lesson) return <LessonNotFound />;

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-background">
      {/* main content area */}
      <ScrollArea className="flex-1 h-full">
        <div className="mx-auto max-w-5xl p-4 md:p-6 lg:p-8 space-y-6">
          {/* mobile header */}
          <div className="flex items-center justify-between md:hidden mb-4">
            <h1 className="text-lg font-bold line-clamp-1">{lesson.title}</h1>
            <MobileSidebar
              lessons={lessons}
              currentId={lessonId}
              courseId={courseId}
              progress={progressPercentage}
            />
          </div>

          {/* player area */}
          <div className="relative w-full">
            {viewMode === "video" ? (
              // video player view
              <div className="space-y-2">
                <div className="relative w-full aspect-video overflow-hidden rounded-xl border bg-black shadow-sm">
                  <VideoPlayer
                    url={lesson.videoUrl}
                    onEnded={handleVideoEnded}
                  />
                </div>

                {/* manual quiz button */}
                {quizData && (
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewMode("quiz")}
                      className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                    >
                      <BrainCircuit className="w-4 h-4 mr-2" /> Take Quiz Now
                    </Button>
                  </div>
                )}
              </div>
            ) : quizData ? (
              // quiz player view
              <QuizPlayer
                //@ts-ignore
                quiz={quizData}
                onPassed={handleQuizPassed}
                onCancel={() => setViewMode("video")}
              />
            ) : (
              // fallback
              <div className="p-8 text-center border rounded-xl bg-slate-50">
                <p>Quiz data not found.</p>
                <Button onClick={() => setViewMode("video")} className="mt-2">
                  Back to Video
                </Button>
              </div>
            )}
          </div>

          {/* navigation controls */}
          <div className="flex flex-col gap-4 border-b pb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold tracking-tight hidden md:block">
                {lesson.title}
              </h1>
              <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                <Button
                  variant="outline"
                  onClick={() => handleNav(nav.prev)}
                  disabled={!nav.prev}
                  className="w-1/2 md:w-auto"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> Prev
                </Button>
                <Button
                  onClick={() => handleNav(nav.next)}
                  disabled={!nav.next}
                  className="w-1/2 md:w-auto bg-indigo-600 hover:bg-indigo-700"
                >
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* description */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">About this lesson</h3>
            <div className="prose prose-slate max-w-none text-slate-600 dark:text-slate-300 text-sm leading-7">
              {lesson.content ? (
                <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
              ) : (
                <p className="italic text-muted-foreground">
                  No description provided.
                </p>
              )}
            </div>
          </div>

          {/* resources */}
          {lesson.resources?.length > 0 && (
            <div className="space-y-4 pt-4 pb-10">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-500" /> Resources
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {lesson.resources.map((res: any, idx: number) => (
                  <ResourceCard key={idx} resource={res} />
                ))}
              </div>
            </div>
          )}

          <LessonCommentSection courseId={courseId} lessonId={lessonId} />
        </div>
      </ScrollArea>

      {/* sidebar */}
      <div className="hidden w-80 lg:w-96 flex-col border-l bg-card md:flex">
        <div className="p-5 border-b">
          <h2 className="font-bold text-lg">Course Content</h2>
          <div className="mt-2 space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground font-medium">
              <span>{progressPercentage}% Completed</span>
              <span>{lessons.length} lessons</span>
            </div>
            {/* progress bar */}
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 h-full">
          <div className="p-3">
            {lessons.map((item: any, idx: number) => (
              <LessonItem
                key={item._id}
                item={item}
                index={idx}
                isActive={item._id === lessonId}
                courseId={courseId}
                isCompleted={item.isCompleted}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

// sub-components

const LessonItem = ({ item, index, isActive, courseId, isCompleted }: any) => {
  return (
    <Link
      href={`/courses/${courseId}/${item._id}`}
      className={cn(
        "flex items-center gap-3 p-3 mb-1 rounded-lg transition-all group border",
        isActive
          ? "bg-indigo-50 border-indigo-200 shadow-sm"
          : "bg-card border-transparent hover:bg-slate-50 hover:border-slate-100"
      )}
    >
      <div className="shrink-0">
        {isActive ? (
          <div className="h-6 w-6 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <PlayCircle className="h-3.5 w-3.5 fill-current" />
          </div>
        ) : isCompleted ? (
          <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <CheckCircle className="h-4 w-4" />
          </div>
        ) : (
          <span className="flex h-6 w-6 items-center justify-center rounded-full border bg-slate-50 text-[10px] text-muted-foreground font-medium group-hover:bg-white group-hover:shadow-sm transition-all">
            {index + 1}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "line-clamp-2 text-sm leading-snug font-medium transition-colors",
            isActive
              ? "text-indigo-900"
              : isCompleted
              ? "text-slate-500"
              : "text-slate-700"
          )}
        >
          {item.title}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-100">
            {formatDuration(item.duration)}
          </span>
        </div>
      </div>
    </Link>
  );
};

const ResourceCard = ({ resource }: { resource: any }) => {
  const isLink = resource.url.includes("http");
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-slate-50 hover:border-indigo-200 transition-all group"
    >
      <div className="h-10 w-10 shrink-0 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 group-hover:scale-105 transition-all">
        {isLink ? (
          <LinkIcon className="h-5 w-5" />
        ) : (
          <Download className="h-5 w-5" />
        )}
      </div>
      <div className="overflow-hidden">
        <p className="text-sm font-medium truncate">{resource.name}</p>
        <p className="text-xs text-muted-foreground truncate">
          {isLink ? "Open link" : "Download file"}
        </p>
      </div>
    </a>
  );
};

const MobileSidebar = ({ lessons, currentId, courseId, progress }: any) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[85%] sm:w-[350px] p-0 flex flex-col"
      >
        <SheetHeader className="p-4 border-b text-left space-y-2">
          <SheetTitle>Course Curriculum</SheetTitle>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{progress}% Completed</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </SheetHeader>
        <ScrollArea className="flex-1">
          <div className="p-3">
            {lessons.map((item: any, idx: number) => (
              <LessonItem
                key={item._id}
                item={item}
                index={idx}
                isActive={item._id === currentId}
                courseId={courseId}
                isCompleted={item.isCompleted}
              />
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

const LessonSkeleton = () => (
  <div className="flex h-[calc(100vh-64px)] w-full">
    <div className="flex-1 p-6 space-y-6">
      <Skeleton className="w-full aspect-video rounded-xl" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-20 w-full" />
    </div>
    <div className="hidden w-96 border-l p-4 space-y-4 md:block">
      <Skeleton className="h-10 w-full" />
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-16 w-full rounded-lg" />
      ))}
    </div>
  </div>
);

const LessonNotFound = () => (
  <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center">
    <h2 className="text-xl font-bold">Lesson not found</h2>
    <p className="text-muted-foreground">
      It seems this lesson does not exist or you don't have access.
    </p>
    <Button asChild>
      <Link href="/dashboard">Go back home</Link>
    </Button>
  </div>
);
