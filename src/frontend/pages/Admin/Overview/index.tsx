"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  CreditCard,
  DollarSign,
  BookOpen,
  ArrowUpRight,
  CalendarDays,
  Download,
  Loader2,
} from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import useGetAdminStats from "@/hooks/dashboard/useGetAdminStats";
import useGetTransactions from "@/hooks/transactions/useGetTransactions";
import formatCurrency from "@/utils/formatCurrency";

export default function OverviewPage() {
  // fetch stats
  const { data: statsData, isLoading: isLoadingStats } = useGetAdminStats();

  // fetch recent transactions
  const { data: trxResponse, isLoading: isLoadingTrx } = useGetTransactions({
    queryParams: {
      limit: 5,
      page: 1,
      sort: "newest",
    },
  });

  const kpi = statsData?.kpi || {
    totalRevenue: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalCourses: 0,
  };
  const chartData = statsData?.chartData || [];
  const recentTransactions = trxResponse?.data || [];

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen font-sans text-sm">
      {/* header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-tight text-slate-800">
            Overview
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            System-wide business performance metrics to date.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="rounded-none h-9 text-xs border-slate-300 bg-white shadow-none"
          >
            <CalendarDays className="mr-2 h-3.5 w-3.5" />
            {new Date().toLocaleDateString("en-US")}
          </Button>
          <Button className="rounded-none h-9 text-xs bg-[#020080] hover:bg-blue-900 shadow-none">
            <Download className="mr-2 h-3.5 w-3.5" />
            Export Report
          </Button>
        </div>
      </div>

      {/* kpi cards section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* revenue */}
        <Card className="rounded-none border-slate-200 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase text-slate-500">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
            ) : (
              <>
                <div className="text-2xl font-bold text-slate-900">
                  {formatCurrency(kpi.totalRevenue)}
                </div>
                <p className="text-xs text-slate-500 flex items-center mt-1">
                  Net revenue (Paid)
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* students */}
        <Card className="rounded-none border-slate-200 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase text-slate-500">
              Students
            </CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
            ) : (
              <>
                <div className="text-2xl font-bold text-slate-900">
                  {kpi.totalUsers}
                </div>
                <p className="text-xs text-green-600 flex items-center mt-1 font-bold">
                  <ArrowUpRight className="h-3 w-3 mr-1" /> Student Accounts
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* orders */}
        <Card className="rounded-none border-slate-200 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase text-slate-500">
              Successful Orders
            </CardTitle>
            <CreditCard className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
            ) : (
              <>
                <div className="text-2xl font-bold text-slate-900">
                  {kpi.totalOrders}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Payment gateway transactions
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* courses */}
        <Card className="rounded-none border-slate-200 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase text-slate-500">
              Total Courses
            </CardTitle>
            <BookOpen className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
            ) : (
              <>
                <div className="text-2xl font-bold text-slate-900">
                  {kpi.totalCourses}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Includes Public & Draft
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* charts & list section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* main chart */}
        <Card className="col-span-4 rounded-none border-slate-200 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase text-slate-800">
              Revenue Chart (12 Months)
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-0">
            {isLoadingStats ? (
              <div className="h-[350px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#020080]" />
              </div>
            ) : (
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="name"
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value / 1000000}M`}
                    />
                    <Tooltip
                      cursor={{ fill: "#f8fafc" }}
                      contentStyle={{
                        borderRadius: "0px",
                        border: "1px solid #e2e8f0",
                        boxShadow: "none",
                        fontSize: "12px",
                      }}
                      formatter={(value: number) => [
                        formatCurrency(value),
                        "Revenue",
                      ]}
                    />
                    <Bar
                      dataKey="total"
                      fill="#020080"
                      radius={[0, 0, 0, 0]}
                      barSize={32}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* recent transactions */}
        <Card className="col-span-3 rounded-none border-slate-200 shadow-sm bg-white flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold uppercase text-slate-800">
              Recent Transactions
            </CardTitle>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-6 text-xs text-[#020080] hover:text-blue-700 p-0 hover:bg-transparent"
            >
              <Link href="/admin/transactions">View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="flex-1">
            {isLoadingTrx ? (
              <div className="h-[300px] flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
              </div>
            ) : recentTransactions.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs italic">
                No transactions found.
              </div>
            ) : (
              <div className="space-y-6">
                {recentTransactions.map((tx: any) => (
                  <div
                    key={tx._id}
                    className="flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-9 w-9 rounded-none border border-slate-200">
                        <AvatarImage src={tx.user?.avatar} />
                        <AvatarFallback className="rounded-none bg-slate-100 font-bold text-slate-600 text-[10px]">
                          {tx.user?.fullName?.[0] || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold leading-none text-slate-800 group-hover:text-[#020080] transition-colors">
                          {tx.user?.fullName || "Guest User"}
                        </p>
                        <p
                          className="text-[10px] text-slate-500 truncate max-w-[120px]"
                          title={tx.course?.title}
                        >
                          {tx.course?.title}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900">
                        {formatCurrency(tx.amount)}
                      </div>
                      <div className="mt-0.5">
                        {tx.status === "success" && (
                          <Badge className="bg-green-50 text-green-700 border-green-200 border rounded-none shadow-none text-[10px] h-4 px-1 font-normal">
                            Success
                          </Badge>
                        )}
                        {tx.status === "pending" && (
                          <Badge
                            variant="outline"
                            className="bg-yellow-50 text-yellow-700 border-yellow-200 border rounded-none text-[10px] h-4 px-1 font-normal"
                          >
                            Pending
                          </Badge>
                        )}
                        {tx.status === "failed" && (
                          <Badge
                            variant="destructive"
                            className="bg-red-50 text-red-700 border-red-200 border rounded-none shadow-none text-[10px] h-4 px-1 font-normal"
                          >
                            Failed
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
