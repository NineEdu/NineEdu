"use client";

import { useState } from "react";
import {
  Calendar,
  Home,
  Inbox,
  Settings,
  ChevronDown,
  ChevronRight,
  FileText,
  Pencil,
  Clock,
  CheckCircle,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/learner", icon: Home },
  {
    title: "My Courses",
    icon: Inbox,
    children: [
      { title: "All Courses", url: "/learner/my-courses/all", icon: FileText },
      {
        title: "In Progress",
        url: "/learner/my-courses/in-progress",
        icon: Pencil,
      },
      {
        title: "Not Started",
        url: "/learner/my-courses/not-started",
        icon: Clock,
      },
      {
        title: "Completed",
        url: "/learner/my-courses/completed",
        icon: CheckCircle,
      },
    ],
  },
  { title: "My Certificates", url: "/learner/my-certificates", icon: Calendar },
  { title: "Wishlist", url: "/learner/wishlist", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const toggleMenu = (title: string) =>
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));

  return (
    <Sidebar>
      <SidebarContent className="!bg-white flex flex-col justify-between min-h-screen">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="mt-[70px] space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.children ? (
                    <>
                      {/* parent */}
                      <SidebarMenuButton
                        onClick={() => toggleMenu(item.title)}
                        className={cn(
                          "flex items-center justify-between text-sm font-medium text-gray-700 px-3 py-2 rounded-lg !h-[50px] cursor-pointer transition-all",
                          "hover:bg-violet-50 hover:text-violet-700",
                          openMenus[item.title] &&
                            "border border-violet-600 text-violet-700 bg-white"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </div>
                        {openMenus[item.title] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </SidebarMenuButton>

                      {/* submenu */}
                      {openMenus[item.title] && (
                        <div className="mt-1 space-y-1">
                          {item.children.map((sub) => (
                            <SidebarMenuButton
                              key={sub.title}
                              asChild
                              data-active={pathname === sub.url}
                              className={cn(
                                "flex items-center gap-3 text-sm font-medium text-gray-700 px-3 py-2 rounded-lg !h-[45px] transition-all ml-6", // <-- thụt nhẹ
                                "hover:bg-violet-50 hover:text-violet-700",
                                "data-[active=true]:border data-[active=true]:border-violet-600 data-[active=true]:bg-white data-[active=true]:text-violet-700"
                              )}
                            >
                              <a
                                href={sub.url}
                                className="flex items-center gap-3 w-full"
                              >
                                <sub.icon className="h-5 w-5" />
                                <span>{sub.title}</span>
                              </a>
                            </SidebarMenuButton>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    // normal item
                    <SidebarMenuButton
                      asChild
                      data-active={pathname === item.url}
                      className={cn(
                        "flex items-center gap-3 text-sm font-medium text-gray-700 px-3 py-2 rounded-lg !h-[50px]",
                        "hover:bg-violet-50 hover:text-violet-700",
                        "data-[active=true]:border data-[active=true]:border-violet-600 data-[active=true]:bg-white data-[active=true]:text-violet-700"
                      )}
                    >
                      <a
                        href={item.url}
                        className="flex items-center gap-3 w-full"
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
