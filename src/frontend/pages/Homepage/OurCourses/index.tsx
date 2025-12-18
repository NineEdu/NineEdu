"use client";

import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { Button } from "@/components/ui/button";
import CourseSummary from "@/components/CourseSummary";
import useGetCourses from "@/hooks/courses/useGetCourses";
import React from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link"; // Import Link để điều hướng

const OurCourses = () => {
  const { data, isFetching: isLoading } = useGetCourses();

  const courses = data?.data;

  return (
    <div className="container mx-auto py-12 px-4 flex flex-col items-center gap-8">
      {/* --- Header Section --- */}
      <div className="max-w-2xl text-center flex flex-col gap-4">
        <Heading size="lg" className="uppercase tracking-wider">
          Our Courses
        </Heading>
        <Text className="text-gray-600">
          Explore a wide range of subjects from the basics to advanced
          applications, develop essential skills, and grow through interactive
          lessons and real-world projects designed by NineEdu’s team of
          educators and experts.
        </Text>
      </div>

      {/* --- Content Section --- */}
      <div className="w-full">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-500">Đang tải khóa học...</span>
          </div>
        ) : courses && courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Chỉ lấy 8 khóa học đầu tiên để hiển thị ở trang chủ */}
            {courses.slice(0, 8).map((course: any) => (
              <CourseSummary key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            Chưa có khóa học nào được hiển thị.
          </div>
        )}
      </div>

      {/* --- Footer Section --- */}
      <Link href="/courses">
        <Button className="mt-4 px-8 py-6 text-lg bg-gray-900 hover:bg-gray-800 text-white rounded-full">
          Explore all courses
        </Button>
      </Link>
    </div>
  );
};

export default OurCourses;
