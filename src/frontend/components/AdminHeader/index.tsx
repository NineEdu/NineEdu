"use client";

import React from "react";
import {
  Bell,
  Search,
  Menu,
  LogOut,
  Settings,
  User,
  HelpCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useCurrentUser } from "@/hooks/useAuth";

export function AdminHeader() {
  const router = useRouter();
  const { data: user } = useCurrentUser();

  const handleLogout = () => {
    // clear cookie
    document.cookie =
      "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center gap-4 border-b bg-white px-6 shadow-sm dark:bg-slate-950">
      {/* mobile menu trigger */}
      <Button variant="ghost" size="icon" className="md:hidden shrink-0">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>

      {/* global search */}
      <div className="flex flex-1 items-center"></div>

      {/* right actions */}
      <div className="flex items-center gap-3">
        {/* user dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full ml-1"
            >
              <Avatar className="h-9 w-9 border border-slate-200">
                <AvatarImage src={user?.avatar} alt={user?.fullName} />
                <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">
                  {user?.fullName?.[0]?.toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.fullName || "Admin User"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || "admin@example.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.push("/admin/settings")}
            >
              <User className="mr-2 h-4 w-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
