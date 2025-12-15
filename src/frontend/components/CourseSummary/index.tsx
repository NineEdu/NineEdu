"use client";
import React from "react";
// import { Card, CardContent } from "../ui/card";
import { Text } from "../Text";
import { Button } from "../ui/button";
import Link from "next/link";

// interfaces
interface Course {
  _id?: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  category: string;
  level: string;
}

interface CourseSummaryProps {
  course: Course;
}

const CourseSummary: React.FC<CourseSummaryProps> = ({ course }) => {
  // destructure
  const { title, description, thumbnail, price, category, level } = course;

  // price helper
  const formatPrice = (amount: number) => {
    if (amount === 0) return "Free";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <Link href={`/courses/${course._id || ""}`}>
      <div className="bg-white rounded-xl shadow-sm border p-4 flex flex-col gap-3 h-full transition-all hover:shadow-md group">
        {/* image container */}
        <div className="w-full h-40 rounded-lg overflow-hidden shadow-sm relative">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* badge */}
          <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] uppercase font-bold px-2 py-1 rounded">
            {category}
          </span>
        </div>

        {/* title */}
        <Text className="font-semibold text-lg line-clamp-1" title={title}>
          {title}
        </Text>

        {/* meta info */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-md">
            {level}
          </span>
          <span
            className={`text-sm font-bold ${
              price === 0 ? "text-green-600" : "text-blue-600"
            }`}
          >
            {formatPrice(price)}
          </span>
        </div>

        {/* description */}
        <Text
          className="text-sm text-gray-600 line-clamp-2 min-h-[40px]"
          title={description}
        >
          {description}
        </Text>

        {/* action button */}
        <Button className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white">
          View Course
        </Button>
      </div>
    </Link>
  );
};

export default CourseSummary;
