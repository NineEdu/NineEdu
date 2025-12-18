"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Plus,
  Search,
  Filter,
  BookOpen,
  CheckCircle,
  FileText,
  DollarSign,
  Loader2,
  EyeOff,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

// hooks & api
import useGetManageCourses from "@/hooks/courses/useGetManageCourses";
import useGetCourseStats from "@/hooks/courses/useGetCourseStats";
import useDeleteCourse from "@/hooks/courses/useDeleteCourse";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import courseApis from "@/shared/apis/courseApis";
import { notifySuccess, notifyError } from "@/components/Notify";
import formatCurrency from "@/utils/formatCurrency";

interface Course {
  _id: string;
  title: string;
  instructorId?: {
    fullName: string;
    avatar: string;
  };
  price: number;
  isPublished: boolean;
  category: string;
  createdAt: string;
  thumbnail?: string;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function ManageCourses() {
  const queryClient = useQueryClient();

  // state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // fetch data
  const { data: coursesResponse, isLoading: isLoadingCourses } =
    useGetManageCourses({
      queryParams: {
        keyword: debouncedSearchTerm,
        isPublished:
          filterStatus === "all" ? undefined : filterStatus === "published",
        sort: "newest",
      },
    });

  const courses: Course[] = coursesResponse?.data || [];
  const pagination = coursesResponse?.pagination;

  const { data: stats, isLoading: isLoadingStats } = useGetCourseStats();

  // delete logic
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  //@ts-ignore
  const { deleteCourse, isPending: isDeleting } = useDeleteCourse();

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteCourse({ courseId: deleteId });
    setIsDeleteDialogOpen(false);
    setDeleteId(null);
    queryClient.invalidateQueries({ queryKey: ["getManageCourses"] });
    queryClient.invalidateQueries({ queryKey: ["getCourseStats"] });
  };

  // toggle publish logic
  const toggleMutation = useMutation({
    mutationFn: async (course: Course) => {
      return await courseApis.updateCourse({
        courseId: course._id,
        dataToUpdate: { isPublished: !course.isPublished },
      });
    },
    onSuccess: () => {
      notifySuccess("Status updated");
      queryClient.invalidateQueries({ queryKey: ["getManageCourses"] });
      queryClient.invalidateQueries({ queryKey: ["getCourseStats"] });
    },
    onError: () => notifyError("Update failed"),
  });

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen font-sans text-sm">
      {/* header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-tight text-slate-900">
            Course Management
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Manage content, moderate courses, and track revenue.
          </p>
        </div>
        <Button
          asChild
          className="bg-[#020080] hover:bg-blue-900 rounded-sm h-9 text-xs uppercase font-semibold shadow-sm"
        >
          <Link href="/admin/courses/create">
            <Plus className="mr-2 h-3.5 w-3.5" /> Create New
          </Link>
        </Button>
      </div>

      {/* stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* total */}
        <div className="bg-white border border-slate-200 p-4 shadow-sm rounded-sm">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
              Total Courses
            </h3>
            <BookOpen className="h-4 w-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {isLoadingStats ? "-" : stats?.totalCourses || 0}
          </div>
        </div>

        {/* published */}
        <div className="bg-white border border-slate-200 p-4 shadow-sm rounded-sm">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
              Published
            </h3>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {isLoadingStats ? "-" : stats?.publishedCourses || 0}
          </div>
        </div>

        {/* draft */}
        <div className="bg-white border border-slate-200 p-4 shadow-sm rounded-sm">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
              Drafts
            </h3>
            <FileText className="h-4 w-4 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {isLoadingStats ? "-" : stats?.draftCourses || 0}
          </div>
        </div>

        {/* value */}
        <div className="bg-white border border-slate-200 p-4 shadow-sm rounded-sm">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
              Total Value
            </h3>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </div>
          <div
            className="text-xl font-bold text-slate-900 truncate"
            title={formatCurrency(stats?.totalValue || 0)}
          >
            {isLoadingStats ? "-" : formatCurrency(stats?.totalValue || 0)}
          </div>
        </div>
      </div>

      {/* toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white p-3 border border-slate-200 shadow-sm rounded-sm">
        {/* search */}
        <div className="sm:col-span-9 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by title..."
            className="pl-9 rounded-sm border-slate-300 focus-visible:ring-0 focus-visible:border-indigo-600 h-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* filter */}
        <div className="sm:col-span-3">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full rounded-sm border-slate-300 h-9 focus:ring-0">
              <div className="flex items-center gap-2 text-slate-600 text-xs">
                <Filter className="h-3.5 w-3.5" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-sm border-slate-200">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* table */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-sm overflow-hidden">
        {isLoadingCourses ? (
          <div className="flex flex-col items-center justify-center p-20">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            <p className="mt-2 text-xs text-slate-500">Loading courses...</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50 border-b border-slate-200">
              <TableRow className="hover:bg-slate-50">
                <TableHead className="w-[80px] pl-4 font-bold text-slate-700 h-10 uppercase text-[10px] tracking-wide">
                  Image
                </TableHead>
                <TableHead className="w-[350px] font-bold text-slate-700 h-10 uppercase text-[10px] tracking-wide">
                  Course Info
                </TableHead>
                <TableHead className="font-bold text-slate-700 h-10 uppercase text-[10px] tracking-wide">
                  Instructor
                </TableHead>
                <TableHead className="font-bold text-slate-700 h-10 uppercase text-[10px] tracking-wide">
                  Status
                </TableHead>
                <TableHead className="text-right font-bold text-slate-700 h-10 uppercase text-[10px] tracking-wide">
                  Price
                </TableHead>
                <TableHead className="w-[50px] pr-4 h-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.length > 0 ? (
                courses.map((course) => (
                  <TableRow
                    key={course._id}
                    className="hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors"
                  >
                    {/* thumbnail */}
                    <TableCell className="pl-4 py-3">
                      <Link href={`/admin/courses/${course._id}`}>
                        <div className="h-10 w-16 bg-slate-100 border border-slate-200 relative shrink-0 overflow-hidden rounded-sm">
                          {course.thumbnail ? (
                            <img
                              src={course.thumbnail}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[9px] text-slate-400 font-bold uppercase">
                              No Img
                            </div>
                          )}
                        </div>
                      </Link>
                    </TableCell>

                    {/* info */}
                    <TableCell>
                      <Link href={`/admin/courses/${course._id}`}>
                        <div className="flex flex-col gap-1">
                          <span
                            className="font-semibold text-slate-900 text-sm truncate max-w-[350px] hover:text-indigo-600 transition-colors"
                            title={course.title}
                          >
                            {course.title}
                          </span>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="secondary"
                              className="rounded-sm border-slate-200 text-[10px] font-medium text-slate-500 bg-slate-100 h-5 px-1.5 shadow-none"
                            >
                              {course.category || "General"}
                            </Badge>
                            <span className="text-[10px] text-slate-400 font-mono">
                              ID: {course._id.slice(-6).toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </TableCell>

                    {/* instructor */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6 border border-slate-200">
                          <AvatarImage src={course.instructorId?.avatar} />
                          <AvatarFallback className="bg-indigo-50 text-indigo-600 text-[9px] font-bold">
                            {course.instructorId?.fullName?.[0] || "A"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-slate-600 truncate max-w-[120px]">
                          {course.instructorId?.fullName || "Admin"}
                        </span>
                      </div>
                    </TableCell>

                    {/* status */}
                    <TableCell>
                      {course.isPublished ? (
                        <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100 rounded-sm shadow-none font-medium px-2 py-0.5">
                          Published
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-slate-100 text-slate-500 border-slate-300 rounded-sm font-medium px-2 py-0.5"
                        >
                          Draft
                        </Badge>
                      )}
                    </TableCell>

                    {/* price */}
                    <TableCell className="text-right font-semibold text-slate-900">
                      {course.price === 0 ? (
                        <span className="text-green-600 text-xs uppercase font-bold">
                          Free
                        </span>
                      ) : (
                        formatCurrency(course.price)
                      )}
                    </TableCell>

                    {/* actions */}
                    <TableCell className="pr-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 rounded-sm hover:bg-slate-200"
                          >
                            <MoreHorizontal className="h-4 w-4 text-slate-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 rounded-sm border-slate-200 shadow-md"
                        >
                          <DropdownMenuLabel className="text-[10px] uppercase text-slate-400 tracking-wider font-bold px-2 py-1.5">
                            Actions
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-slate-100" />

                          <DropdownMenuItem
                            asChild
                            className="rounded-sm cursor-pointer text-xs"
                          >
                            <Link href={`/admin/courses/${course._id}`}>
                              <ExternalLink className="mr-2 h-3.5 w-3.5 text-slate-500" />
                              Manage Course
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            asChild
                            className="rounded-sm cursor-pointer text-xs"
                          >
                            <Link
                              href={`/admin/courses/${course._id}/settings`}
                            >
                              <Pencil className="mr-2 h-3.5 w-3.5 text-slate-500" />
                              Edit Details
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="cursor-pointer rounded-sm text-xs"
                            onClick={() => toggleMutation.mutate(course)}
                          >
                            {course.isPublished ? (
                              <>
                                <EyeOff className="mr-2 h-3.5 w-3.5 text-orange-500" />
                                Unpublish
                              </>
                            ) : (
                              <>
                                <ArrowUpRight className="mr-2 h-3.5 w-3.5 text-green-600" />
                                Publish Now
                              </>
                            )}
                          </DropdownMenuItem>

                          <DropdownMenuSeparator className="bg-slate-100" />

                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer rounded-sm text-xs"
                            onClick={() => {
                              setDeleteId(course._id);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Search className="h-6 w-6 mb-2 opacity-20" />
                      <p className="text-xs font-medium">No courses found.</p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Try adjusting your search or filters.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* pagination */}
      {pagination && (
        <div className="flex justify-between items-center border border-slate-200 bg-white p-2 px-4 rounded-sm shadow-sm text-xs text-slate-500">
          <span>
            Total:{" "}
            <span className="font-bold text-slate-700">
              {pagination.totalCourses}
            </span>{" "}
            items
          </span>
          <span>Page {pagination.currentPage}</span>
        </div>
      )}

      {/* delete dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="rounded-sm border-slate-200 max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600 flex items-center gap-2 text-lg">
              <Trash2 className="w-5 h-5" /> Delete Course?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600 text-sm">
              This action cannot be undone. All lessons, quizzes, and student
              enrollments associated with this course will be permanently
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              className="rounded-sm border-slate-300 h-9 text-xs"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white rounded-sm shadow-sm h-9 text-xs"
            >
              {isDeleting ? (
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              ) : (
                "Confirm Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
