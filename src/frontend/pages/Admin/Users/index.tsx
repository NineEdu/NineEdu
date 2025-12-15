"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  Shield,
  ShieldAlert,
  Trash2,
  Lock,
  Unlock,
  Mail,
  Loader2,
  UserCog,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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

import useGetUsers from "@/hooks/users/useGetUsers";
import useUpdateUser from "@/hooks/users/useUpdateUser";
import useDeleteUser from "@/hooks/users/useDeleteUser";
import { useCurrentUser } from "@/hooks/useAuth";
import formatDate from "@/utils/formatData";

// helper for role badges
const getRoleBadge = (role: string) => {
  switch (role) {
    case "admin":
      return (
        <Badge className="bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-none shadow-none font-normal">
          Administrator
        </Badge>
      );
    case "instructor":
      return (
        <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-none shadow-none font-normal">
          Instructor
        </Badge>
      );
    default:
      return (
        <Badge
          variant="secondary"
          className="bg-slate-50 text-slate-600 border border-slate-200 rounded-none font-normal"
        >
          Student
        </Badge>
      );
  }
};

export default function ManageUsersPage() {
  const { data: currentUser } = useCurrentUser();

  // state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);

  // delete modal state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // api hooks
  const { data: response, isLoading } = useGetUsers({
    queryParams: {
      keyword: debouncedSearch,
      role: roleFilter === "all" ? undefined : roleFilter,
      page,
      limit: 10,
    },
  });

  const users = response?.users || [];
  const pagination = response?.pagination;

  //@ts-ignore
  const { updateUser, isPending: isUpdating } = useUpdateUser();
  //@ts-ignore
  const { deleteUser, isPending: isDeleting } = useDeleteUser();

  // handlers
  const handleChangeRole = (userId: string, newRole: string) => {
    if (userId === currentUser?._id) return;
    updateUser({ userId, data: { role: newRole } });
  };

  const handleToggleBlock = (userId: string, currentStatus: boolean) => {
    if (userId === currentUser?._id) return;
    updateUser({ userId, data: { isBlocked: !currentStatus } });
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    await deleteUser({ userId: deleteId });
    setShowDeleteDialog(false);
    setDeleteId(null);
  };

  return (
    <div className="p-6 space-y-4 bg-slate-50 min-h-screen font-sans text-sm">
      {/* header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-tight text-slate-800">
            User Management
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Manage accounts, permissions, and activity status.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 bg-white px-3 py-1 border border-slate-200">
            Total: <strong>{pagination?.totalUsers || 0}</strong> users
          </span>
        </div>
      </div>

      {/* toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white p-3 border border-slate-200 shadow-sm">
        <div className="sm:col-span-9 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by name or email..."
            className="pl-9 bg-slate-50 border-slate-300 focus:bg-white focus-visible:ring-0 focus-visible:border-indigo-600 rounded-none h-10 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="sm:col-span-3">
          <Select
            value={roleFilter}
            onValueChange={(val) => {
              setRoleFilter(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full bg-slate-50 border-slate-300 rounded-none h-10 focus:ring-0">
              <div className="flex items-center gap-2 text-slate-600">
                <Filter className="h-3.5 w-3.5" />
                <SelectValue placeholder="Filter by Role" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-none border-slate-200">
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Administrator</SelectItem>
              <SelectItem value="instructor">Instructor</SelectItem>
              <SelectItem value="student">Student</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* table */}
      <div className="border border-slate-200 bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="hover:bg-slate-50 border-b border-slate-200">
              <TableHead className="w-[300px] pl-4 font-bold text-slate-700 rounded-none h-11 uppercase text-[11px]">
                User Info
              </TableHead>
              <TableHead className="font-bold text-slate-700 h-11 uppercase text-[11px]">
                Role
              </TableHead>
              <TableHead className="font-bold text-slate-700 h-11 uppercase text-[11px]">
                Status
              </TableHead>
              <TableHead className="font-bold text-slate-700 h-11 uppercase text-[11px]">
                Joined Date
              </TableHead>
              <TableHead className="text-right pr-4 font-bold text-slate-700 rounded-none h-11 uppercase text-[11px]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell
                    colSpan={5}
                    className="h-12 text-center text-slate-400"
                  >
                    <Loader2 className="animate-spin h-4 w-4 mx-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-slate-500 italic"
                >
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user: any) => (
                <TableRow
                  key={user._id}
                  className="hover:bg-slate-50 border-b border-slate-100 last:border-0"
                >
                  {/* user info */}
                  <TableCell className="pl-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-slate-200 rounded-none">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-slate-100 text-slate-600 text-xs font-bold rounded-none">
                          {user.fullName?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-sm">
                          {user.fullName}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* role */}
                  <TableCell>{getRoleBadge(user.role)}</TableCell>

                  {/* status */}
                  <TableCell>
                    {user.isBlocked ? (
                      <Badge
                        variant="destructive"
                        className="flex w-fit items-center gap-1 bg-red-50 text-red-600 border-red-200 border rounded-none shadow-none font-normal"
                      >
                        <Lock className="h-3 w-3" /> Blocked
                      </Badge>
                    ) : (
                      <Badge className="flex w-fit items-center gap-1 bg-green-50 text-green-700 border-green-200 border rounded-none shadow-none font-normal hover:bg-green-100">
                        <CheckCircle2 className="h-3 w-3" /> Active
                      </Badge>
                    )}
                  </TableCell>

                  {/* date */}
                  <TableCell className="text-xs text-slate-500 font-mono">
                    {formatDate(user.createdAt)}
                  </TableCell>

                  {/* actions */}
                  <TableCell className="pr-4 text-right">
                    {currentUser?._id !== user._id && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none hover:bg-slate-200"
                          >
                            <MoreVertical className="h-4 w-4 text-slate-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-56 rounded-none border-slate-200"
                        >
                          <DropdownMenuLabel className="text-xs uppercase text-slate-400">
                            Options
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            className="rounded-none cursor-pointer"
                            onClick={() =>
                              (window.location.href = `mailto:${user.email}`)
                            }
                          >
                            <Mail className="mr-2 h-4 w-4 text-slate-500" />{" "}
                            Send Email
                          </DropdownMenuItem>

                          {/* role submenu */}
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="rounded-none cursor-pointer">
                              <UserCog className="mr-2 h-4 w-4 text-slate-500" />{" "}
                              Change Role
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent className="rounded-none border-slate-200">
                              <DropdownMenuRadioGroup
                                value={user.role}
                                onValueChange={(val) =>
                                  handleChangeRole(user._id, val)
                                }
                              >
                                <DropdownMenuRadioItem
                                  value="student"
                                  className="cursor-pointer"
                                >
                                  Student
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem
                                  value="instructor"
                                  className="cursor-pointer"
                                >
                                  Instructor
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem
                                  value="admin"
                                  className="cursor-pointer"
                                >
                                  Administrator
                                </DropdownMenuRadioItem>
                              </DropdownMenuRadioGroup>
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>

                          <DropdownMenuSeparator />

                          {/* block/unblock */}
                          <DropdownMenuItem
                            className="rounded-none cursor-pointer"
                            onClick={() =>
                              handleToggleBlock(user._id, user.isBlocked)
                            }
                          >
                            {user.isBlocked ? (
                              <>
                                <Unlock className="mr-2 h-4 w-4 text-green-600" />{" "}
                                Unlock Account
                              </>
                            ) : (
                              <>
                                <Lock className="mr-2 h-4 w-4 text-orange-600" />{" "}
                                Lock Account
                              </>
                            )}
                          </DropdownMenuItem>

                          {/* delete */}
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600 focus:bg-red-50 rounded-none cursor-pointer"
                            onClick={() => {
                              setDeleteId(user._id);
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                            Permanently
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
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
            Showing {users.length} / {pagination.totalUsers} results
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

      {/* confirm delete dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="rounded-none border-slate-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <ShieldAlert className="h-5 w-5" /> Delete this user?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All course data and learning
              progress associated with this user will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              className="rounded-none border-slate-300"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 rounded-none shadow-none"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="animate-spin h-4 w-4" />
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
