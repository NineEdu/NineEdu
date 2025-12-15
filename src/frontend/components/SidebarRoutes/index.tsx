"use client";

import {
  LayoutDashboard,
  List,
  Users,
  Megaphone,
  Settings,
  BarChart,
  Award,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

// define routes
const guestRoutes = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: List,
    label: "Curriculum",
    href: "/curriculum",
  },
  {
    icon: Users,
    label: "Students",
    href: "/students",
  },
  {
    icon: Megaphone,
    label: "Conversations",
    href: "/conversations",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/analytics",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "/settings",
  },
];

interface SidebarRoutesProps {
  courseId: string;
}

export const SidebarRoutes = ({ courseId }: SidebarRoutesProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const baseUrl = `/admin/courses/${courseId}`;

  return (
    <div className="flex flex-col w-full">
      {guestRoutes.map((route) => {
        const fullPath =
          route.href === "/" ? baseUrl : `${baseUrl}${route.href}`;

        // check active state
        const isActive =
          (route.href === "/" && pathname === baseUrl) ||
          (route.href !== "/" &&
            pathname?.startsWith(`${baseUrl}${route.href}`));

        return (
          <button
            key={route.href}
            onClick={() => router.push(fullPath)}
            className={`
              flex items-center gap-x-2 text-slate-500 text-sm font-medium pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20 h-12 w-full
              ${
                isActive
                  ? "text-[#020080] bg-indigo-50 hover:bg-indigo-50 hover:text-[#020080] border-r-4 border-[#020080]"
                  : ""
              }
            `}
          >
            <route.icon
              size={22}
              className={isActive ? "text-[#020080]" : "text-slate-500"}
            />
            {route.label}
          </button>
        );
      })}
    </div>
  );
};
