"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  Award,
  Settings,
  LogOut,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/student",
  },
  {
    label: "My Courses",
    icon: BookOpen,
    href: "/student/courses",
  },
  {
    label: "Certificates",
    icon: Award,
    href: "/student/certificates",
  },
  {
    label: "Profile",
    icon: User,
    href: "/student/profile",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/student/settings",
  },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-white border-r py-4">
      <div className="flex-1 px-3 space-y-1">
        {routes.map((route) => {
          const isActive =
            route.href === "/student"
              ? pathname === "/student"
              : pathname?.startsWith(route.href);

          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-all",
                isActive
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <route.icon
                className={cn(
                  "w-5 h-5",
                  isActive
                    ? "text-slate-900"
                    : "text-slate-400 group-hover:text-slate-900"
                )}
              />
              {route.label}
            </Link>
          );
        })}
      </div>

      <div className="px-3 mt-auto pt-4 border-t">
        <button className="flex items-center gap-3 px-3 py-2.5 w-full text-sm font-medium text-slate-500 rounded-md hover:text-red-600 hover:bg-red-50 transition-colors">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};
