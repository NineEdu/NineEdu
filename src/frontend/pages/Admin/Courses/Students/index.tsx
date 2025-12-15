"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  Search,
  MoreVertical,
  Mail,
  UserX,
  Download,
  Loader2,
  AlertCircle,
  Inbox,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import useGetStudents from "@/hooks/dashboard/useGetStudents";
import { notifyInfo } from "@/components/Notify";
import formatDate from "@/utils/formatData";

export default function StudentsPage() {
  const params = useParams();
  const courseId = params?.courseId as string;
  const [searchTerm, setSearchTerm] = useState("");

  // fetch student data
  const {
    data: students = [],
    isLoading,
    isError,
  } = useGetStudents({
    queryParams: {
      courseId,
      keyword: searchTerm,
    },
  });

  // handlers
  const handleExportCSV = () => {
    notifyInfo("CSV export coming soon");
  };

  const handleSendEmail = (email: string) => {
    window.open(`mailto:${email}`);
  };

  return (
    <div className="space-y-6">
      {/* header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Student Management
          </h2>
          <p className="text-muted-foreground">
            Track progress and manage enrollments.
          </p>
        </div>
        <Button variant="outline" onClick={handleExportCSV}>
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* main content card */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="p-6 pb-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <CardTitle className="text-lg font-medium">
              Students ({students.length})
            </CardTitle>

            {/* search input */}
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name or email..."
                className="pl-9 bg-slate-50 focus:bg-white transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* loading state */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <Loader2 className="h-8 w-8 animate-spin text-[#020080] mb-2" />
              <p>Loading student list...</p>
            </div>
          )}

          {/* error state */}
          {isError && (
            <div className="flex flex-col items-center justify-center py-20 text-red-500">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p>Failed to load data. Please try again.</p>
            </div>
          )}

          {/* student table */}
          {!isLoading && !isError && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="w-[300px] pl-6">Student</TableHead>
                    <TableHead>Joined Date</TableHead>
                    <TableHead className="w-[200px]">Progress</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.length > 0 ? (
                    students.map((student: any) => (
                      <TableRow
                        key={student.enrollmentId}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        {/* student info */}
                        <TableCell className="pl-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border border-slate-200">
                              <AvatarImage src={student.avatar} />
                              <AvatarFallback className="bg-indigo-50 text-indigo-600 text-xs font-bold">
                                {student.name?.[0]?.toUpperCase() || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-semibold text-sm text-slate-900">
                                {student.name}
                              </span>
                              <span
                                className="text-xs text-slate-500 truncate max-w-[180px]"
                                title={student.email}
                              >
                                {student.email}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        {/* joined date */}
                        <TableCell className="text-sm text-slate-600">
                          {formatDate(student.joinedAt)}
                        </TableCell>

                        {/* progress bar */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Progress
                              value={student.progress}
                              className="h-2 flex-1 bg-slate-100"
                            />
                            <span className="text-xs font-bold w-9 text-right text-slate-700">
                              {student.progress}%
                            </span>
                          </div>
                        </TableCell>

                        {/* status badge */}
                        <TableCell>
                          {student.progress === 100 ? (
                            <Badge className="bg-green-600 hover:bg-green-700">
                              Completed
                            </Badge>
                          ) : student.progress > 0 ? (
                            <Badge className="bg-blue-600 hover:bg-blue-700">
                              In Progress
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Not Started</Badge>
                          )}
                        </TableCell>

                        {/* action menu */}
                        <TableCell className="text-right pr-6">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-slate-100 rounded-full"
                              >
                                <MoreVertical className="h-4 w-4 text-slate-500" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel>Options</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => handleSendEmail(student.email)}
                              >
                                <Mail className="mr-2 h-4 w-4 text-slate-500" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50">
                                <UserX className="mr-2 h-4 w-4" /> Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    // empty state
                    <TableRow>
                      <TableCell colSpan={5} className="h-40 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-500">
                          <div className="bg-slate-50 p-3 rounded-full mb-3">
                            <Inbox className="h-6 w-6 text-slate-300" />
                          </div>
                          <p className="text-sm font-medium">
                            No students found.
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {searchTerm
                              ? "Try searching with a different keyword."
                              : "This course has no enrollments yet."}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
