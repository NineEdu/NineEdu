import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { BookOpen, CheckCircle, FileText } from "lucide-react";
import Image from "next/image";
import React from "react";

const Dashboard = () => {
  return (
    <div className="w-full min-h-screen p-4 flex flex-col gap-6 bg-gray-50">
      {/* header */}
      <div className="w-full rounded-2xl p-6 flex justify-between items-center bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200">
        {/* title  */}
        <Heading className="lg:text-2xl text-xl font-semibold text-gray-900">
          Welcome Souta Sakai!
        </Heading>

        {/* avatar */}
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
          <Image
            src="/avatar.png"
            alt="User Avatar"
            width={48}
            height={48}
            className="object-cover"
          />
        </div>
      </div>

      {/* info */}
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-4">
        {/* in process */}
        <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border">
          {/* icon and text */}
          <div className="flex items-center gap-3">
            <BookOpen className="text-pink-500" />
            <Text className="font-medium">In Progress Courses</Text>
          </div>

          {/* quatily */}
          <Text className="text-lg font-semibold text-pink-600">1</Text>
        </div>

        {/* complete  */}
        <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border">
          {/* icon and text */}
          <div className="flex items-center gap-3">
            <CheckCircle className="text-yellow-500" />
            <Text className="font-medium">Completed Courses</Text>
          </div>

          {/* quatily */}
          <Text className="text-lg font-semibold text-yellow-600">0</Text>
        </div>

        {/* not started  */}
        <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border">
          {/* icon and text  */}
          <div className="flex items-center gap-3">
            <FileText className="text-green-500" />
            <Text className="font-medium">Not Started Courses</Text>
          </div>

          {/* quatily */}
          <Text className="text-lg font-semibold text-green-600">0</Text>
        </div>
      </div>

      {/* my courses & certi */}
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
        {/* in process */}
        <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col gap-3">
          <div className="flex justify-between items-center">
            {/* title  */}
            <Heading size="sm" className="font-semibold">
              My In Progress Courses
            </Heading>

            {/* view all */}
            <button className="text-sm text-gray-600 hover:underline">
              View all
            </button>
          </div>

          {/* course img  */}
          <div className="w-full h-[180px] rounded-xl overflow-hidden shadow-sm">
            <Image
              src="/course1.png"
              alt="Course"
              width={600}
              height={300}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* certi */}
        <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <Heading size="sm" className="font-semibold">
              My Certificates
            </Heading>
            <button className="text-sm text-gray-600 hover:underline">
              View all
            </button>
          </div>

          <div className="flex justify-center items-center w-full h-[180px]">
            <Image
              src="/certificate.png"
              alt="Certificate"
              width={160}
              height={160}
              className="opacity-80"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
