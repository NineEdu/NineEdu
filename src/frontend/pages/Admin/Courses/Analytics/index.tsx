"use client";

import React from "react";
import { useParams } from "next/navigation";
import {
  TrendingUp,
  Users,
  Activity,
  Calendar as CalendarIcon,
  Download,
  DollarSign,
  BarChart3, // icon for empty revenue
  LineChart, // icon for empty students
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, Area, AreaChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import useGetCourseStats from "@/hooks/dashboard/useGetCourseStats";
import formatCurrency from "@/utils/formatCurrency";

// chart configuration
const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: "#020080",
  },
} satisfies ChartConfig;

const studentChartConfig = {
  students: {
    label: "New students",
    color: "#16a34a",
  },
} satisfies ChartConfig;

export default function AnalyticsPage() {
  const params = useParams();
  const courseId = params?.courseId as string;

  // fetch data from api
  const { data: stats, isLoading } = useGetCourseStats({
    queryParams: { courseId },
  });

  // check if data is available for charts
  const hasRevenueData =
    stats?.revenueChartData && stats.revenueChartData.length > 0;
  const hasEnrollmentData =
    stats?.enrollmentData && stats.enrollmentData.length > 0;
  const hasOverallData =
    stats && (stats.totalRevenue > 0 || stats.totalStudents > 0);

  // render loading state
  if (isLoading) {
    return (
      <div className="space-y-8 pb-20">
        <div className="flex justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid gap-8 lg:grid-cols-7">
          <Skeleton className="lg:col-span-4 h-[400px] rounded-xl" />
          <Skeleton className="lg:col-span-3 h-[400px] rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Analytics & reports
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Track the performance and engagement of this course.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="year">
            <SelectTrigger className="w-[140px] bg-white">
              <CalendarIcon className="w-4 h-4 mr-2 text-slate-500" />
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">This month</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" disabled={!hasOverallData}>
            <Download className="w-4 h-4 text-slate-600" />
          </Button>
        </div>
      </div>

      {/* kpi cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* total revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(stats?.totalRevenue || 0)}
            </div>
            {stats?.revenueGrowth !== undefined && (
              <p className="text-xs text-slate-500 mt-1">
                {stats.revenueGrowth > 0 ? "+" : ""}
                {stats.revenueGrowth}% from last month
              </p>
            )}
          </CardContent>
        </Card>

        {/* total students */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Students
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {stats?.totalStudents || 0}
            </div>
            {stats?.newStudentsCount !== undefined && (
              <p className="text-xs text-slate-500 mt-1">
                +{stats.newStudentsCount} new this month
              </p>
            )}
          </CardContent>
        </Card>

        {/* completion rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Completion rate
            </CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {stats?.avgCompletion || 0}%
            </div>
            <p className="text-xs text-slate-500 mt-1">Course average</p>
          </CardContent>
        </Card>

        {/* rating */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Rating
            </CardTitle>
            <div className="text-yellow-500 font-bold text-xs">
              ★ {stats?.rating || 0}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {stats?.rating || 0}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Based on {stats?.reviewCount || 0} reviews
            </p>
          </CardContent>
        </Card>
      </div>

      {/* charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
        {/* revenue bar chart */}
        <Card className="lg:col-span-4 border-slate-200 shadow-sm flex flex-col">
          <CardHeader>
            <CardTitle>Revenue overview</CardTitle>
            <CardDescription>Monthly revenue breakdown</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px] flex items-center justify-center">
            {hasRevenueData ? (
              <ChartContainer
                config={revenueChartConfig}
                className="h-full w-full"
              >
                <BarChart accessibilityLayer data={stats.revenueChartData}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        formatter={(value) => formatCurrency(Number(value))}
                      />
                    }
                  />
                  <Bar
                    dataKey="revenue"
                    fill="var(--color-revenue)"
                    radius={[4, 4, 0, 0]}
                    barSize={32}
                  />
                </BarChart>
              </ChartContainer>
            ) : (
              // empty state for revenue
              <div className="flex flex-col items-center justify-center text-slate-400 py-10">
                <div className="p-4 bg-slate-50 rounded-full mb-3">
                  <BarChart3 className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-sm font-medium">No revenue data yet</p>
                <p className="text-xs text-slate-400 mt-1">
                  Sales will appear here
                </p>
              </div>
            )}
          </CardContent>
          {hasRevenueData && (
            <CardFooter className="flex-col items-start gap-2 text-sm border-t pt-4">
              <div className="flex gap-2 font-medium leading-none">
                Trending up by 5.2% this month{" "}
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div className="leading-none text-muted-foreground">
                Data is updated in real-time.
              </div>
            </CardFooter>
          )}
        </Card>

        {/* students area chart */}
        <Card className="lg:col-span-3 border-slate-200 shadow-sm flex flex-col">
          <CardHeader>
            <CardTitle>Enrollment trend</CardTitle>
            <CardDescription>New students over time</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px] flex items-center justify-center">
            {hasEnrollmentData ? (
              <ChartContainer
                config={studentChartConfig}
                className="h-full w-full"
              >
                <AreaChart
                  accessibilityLayer
                  data={stats.enrollmentData}
                  margin={{ left: 12, right: 12 }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Area
                    dataKey="students"
                    type="natural"
                    fill="var(--color-students)"
                    fillOpacity={0.4}
                    stroke="var(--color-students)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            ) : (
              // empty state for students
              <div className="flex flex-col items-center justify-center text-slate-400 py-10">
                <div className="p-4 bg-slate-50 rounded-full mb-3">
                  <LineChart className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-sm font-medium">No enrollments yet</p>
                <p className="text-xs text-slate-400 mt-1">
                  Student activity will show here
                </p>
              </div>
            )}
          </CardContent>
          {hasEnrollmentData && (
            <CardFooter>
              <div className="flex w-full items-start gap-2 text-sm border-t pt-4">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 font-medium leading-none">
                    Steady growth detected{" "}
                    <Activity className="h-4 w-4 text-orange-500" />
                  </div>
                </div>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
