"use client";

import React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  LogOut,
  Settings,
  Sun,
  Moon,
  LayoutDashboard,
  Loader2,
  ChevronDown,
} from "lucide-react";

// Import Hooks xác thực
import { useCurrentUser, useLogout } from "@/hooks/useAuth";

export function Navbar() {
  const { theme, setTheme } = useTheme();

  // 1. Lấy thông tin User hiện tại từ Hook
  const { data: user, isLoading } = useCurrentUser();

  // 2. Lấy hàm đăng xuất
  const logout = useLogout();

  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-[#10069d] border-b border-white/10 fixed w-full top-0 z-50 shadow-md transition-colors duration-300 dark:bg-slate-950 dark:border-slate-800">
      {/* --- LEFT: LOGO & MENU --- */}
      <div className="flex items-center space-x-4 ml-4 md:ml-14">
        <Link href="/">
          {/* Logo NineEdu */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/nine-logo.png"
            alt="NineEdu"
            className="h-[45px] object-cover"
          />
        </Link>

        <ul className="hidden md:flex items-center space-x-6 pl-4 text-white font-semibold">
          <li>
            <Link
              href="/"
              className="hover:underline hover:text-indigo-200 transition-all"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/courses"
              className="hover:underline hover:text-indigo-200 transition-all"
            >
              Courses
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="hover:underline hover:text-indigo-200 transition-all"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="hover:underline hover:text-indigo-200 transition-all"
            >
              Contact
            </Link>
          </li>
        </ul>
      </div>

      {/* --- RIGHT: ACTIONS --- */}
      <div className="flex items-center space-x-3 mr-4">
        {/* 1. THEME TOGGLE (Icon Only) */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="text-white hover:bg-white/20 hover:text-white rounded-full"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* 2. AUTHENTICATION SECTION */}
        {isLoading ? (
          // Loading State
          <div className="flex items-center justify-center w-10 h-10">
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          </div>
        ) : user ? (
          /* --- ĐÃ ĐĂNG NHẬP (HIỆN AVATAR + DROPDOWN) --- */
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full hover:bg-white/20 focus-visible:ring-0 focus-visible:ring-offset-0 ml-2"
              >
                <Avatar className="h-9 w-9 border-2 border-white/30">
                  <AvatarImage src={user?.avatar} alt={user?.fullName} />
                  <AvatarFallback className="bg-indigo-700 text-white font-bold">
                    {user?.fullName
                      ? user.fullName.charAt(0).toUpperCase()
                      : "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none truncate">
                    {user.fullName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* DASHBOARD LINK */}
              <DropdownMenuItem asChild>
                <Link
                  href={
                    user.role === "admin" || user.role === "instructor"
                      ? "/admin"
                      : "/student"
                  }
                  className="cursor-pointer w-full flex items-center"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem className="cursor-pointer">
                <Link
                  href={`/profile/${user._id}`}
                  className="cursor-pointer w-full flex items-center"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Link
                  href="/profile/settings"
                  className="cursor-pointer w-full flex items-center"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          /* --- CHƯA ĐĂNG NHẬP (HIỆN LOGIN/REGISTER) --- */
          <div className="flex items-center space-x-3 ml-2">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20 hover:text-white font-semibold"
              >
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-white text-[#10069d] hover:bg-indigo-50 font-bold shadow-sm border border-transparent hover:border-indigo-200 transition-colors">
                Register
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
