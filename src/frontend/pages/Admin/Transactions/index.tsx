"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  Loader2,
  ArrowRight,
  ArrowLeft,
  RefreshCcw,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import useGetTransactions from "@/hooks/transactions/useGetTransactions";
import formatCurrency from "@/utils/formatCurrency";
import formatDate from "@/utils/formatData";

// helper for status badges
const getStatusBadge = (status: string) => {
  switch (status) {
    case "success":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 border rounded-none shadow-none font-normal">
          Success
        </Badge>
      );
    case "pending":
      return (
        <Badge
          variant="outline"
          className="text-yellow-700 bg-yellow-50 border-yellow-200 rounded-none font-normal"
        >
          Pending
        </Badge>
      );
    case "failed":
      return (
        <Badge
          variant="destructive"
          className="bg-red-50 text-red-700 border-red-200 border hover:bg-red-100 rounded-none shadow-none font-normal"
        >
          Failed
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className="rounded-none">
          {status}
        </Badge>
      );
  }
};

export default function TransactionsPage() {
  // state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // api hook
  const {
    data: response,
    isLoading,
    refetch,
    isRefetching,
  } = useGetTransactions({
    queryParams: {
      search: debouncedSearch,
      status: statusFilter === "all" ? undefined : statusFilter,
      page,
      limit: 10,
    },
  });

  const transactions = response?.data || [];
  const pagination = response?.pagination;

  return (
    <div className="space-y-4 font-sans text-sm p-6">
      {/* header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-tight text-slate-800">
            Transaction Management
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            System-wide payment history list.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-none border-slate-300 gap-2 h-9"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            <RefreshCcw
              className={`w-3.5 h-3.5 ${isRefetching ? "animate-spin" : ""}`}
            />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-none border-slate-300 gap-2 h-9"
          >
            <Download className="w-3.5 h-3.5" /> Export Excel
          </Button>
        </div>
      </div>

      {/* filter toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white p-3 border border-slate-200 shadow-sm">
        <div className="sm:col-span-9 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search Order ID (or user name)..."
            className="pl-9 rounded-none border-slate-300 focus-visible:ring-0 focus-visible:border-indigo-600 h-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="sm:col-span-3">
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full rounded-none border-slate-300 h-10 focus:ring-0">
              <div className="flex items-center gap-2 text-slate-600">
                <Filter className="h-3.5 w-3.5" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-none border-slate-200">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* data table */}
      <div className="border border-slate-200 bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="hover:bg-slate-50 border-b border-slate-200">
              <TableHead className="w-[140px] font-bold text-slate-700 rounded-none h-11 uppercase text-[11px]">
                Order ID
              </TableHead>
              <TableHead className="font-bold text-slate-700 h-11 uppercase text-[11px]">
                Customer
              </TableHead>
              <TableHead className="font-bold text-slate-700 h-11 uppercase text-[11px]">
                Content
              </TableHead>
              <TableHead className="font-bold text-slate-700 h-11 uppercase text-[11px]">
                Amount
              </TableHead>
              <TableHead className="font-bold text-slate-700 h-11 uppercase text-[11px]">
                Gateway
              </TableHead>
              <TableHead className="font-bold text-slate-700 h-11 uppercase text-[11px]">
                Status
              </TableHead>
              <TableHead className="text-right font-bold text-slate-700 rounded-none h-11 uppercase text-[11px] pr-4">
                Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={7} className="h-12 text-center">
                    <Loader2 className="animate-spin h-4 w-4 mx-auto text-slate-400" />
                  </TableCell>
                </TableRow>
              ))
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-32 text-center text-slate-500 italic"
                >
                  No transaction data found.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((tx: any) => (
                <TableRow
                  key={tx._id}
                  className="hover:bg-slate-50 border-b border-slate-100 last:border-0"
                >
                  {/* code */}
                  <TableCell className="font-mono text-xs font-medium text-slate-600">
                    {tx.transactionCode}
                  </TableCell>

                  {/* user */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6 rounded-none border border-slate-200">
                        <AvatarImage src={tx.user?.avatar} />
                        <AvatarFallback className="rounded-none bg-slate-100 text-[10px] text-slate-600 font-bold">
                          {tx.user?.fullName?.[0] || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-slate-800">
                        {tx.user?.fullName || "Hidden User"}
                      </span>
                    </div>
                  </TableCell>

                  {/* course title */}
                  <TableCell className="max-w-[220px]">
                    <p
                      className="truncate text-slate-600 text-xs"
                      title={tx.course?.title}
                    >
                      {tx.course?.title || "Course Payment"}
                    </p>
                  </TableCell>

                  {/* amount */}
                  <TableCell className="font-bold text-slate-900">
                    {formatCurrency(tx.amount)}
                  </TableCell>

                  {/* method */}
                  <TableCell className="text-xs uppercase text-slate-500">
                    {tx.paymentMethod}
                  </TableCell>

                  {/* status */}
                  <TableCell>{getStatusBadge(tx.status)}</TableCell>

                  {/* date */}
                  <TableCell className="text-right text-xs text-slate-500 pr-4">
                    {formatDate(tx.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between bg-white border border-slate-200 p-2 shadow-sm">
          <span className="text-xs text-slate-500 pl-2">
            Showing {transactions.length} / {pagination.totalDocs} results
          </span>
          <div className="flex gap-[-1px]">
            <Button
              variant="outline"
              size="sm"
              className="rounded-none border-r-0 h-8 w-8 p-0 hover:bg-slate-100"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="border-y border-slate-200 px-4 flex items-center text-xs font-medium min-w-[3rem] justify-center bg-slate-50">
              {page} / {pagination.pages}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-none border-l-0 h-8 w-8 p-0 hover:bg-slate-100"
              disabled={page === pagination.pages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
