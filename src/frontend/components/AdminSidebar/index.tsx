"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  LayoutDashboard,
  ChevronDown,
  BookOpen,
  Users,
  Banknote,
} from "lucide-react";

const sidebarData = [
  {
    group: "DASHBOARD",
    items: [
      {
        title: "Overview",
        icon: LayoutDashboard,
        href: "/admin",
      },
    ],
  },
  {
    group: "CONTENT & USERS",
    items: [
      {
        title: "Manage Users",
        icon: Users,
        href: "/admin/users",
      },
      {
        title: "Manage Courses",
        icon: BookOpen,
        href: "/admin/courses",
      },
    ],
  },
  {
    group: "FINANCE",
    items: [
      {
        title: "Transactions",
        icon: Banknote,
        href: "/admin/transactions",
      },
    ],
  },
];

const MenuItem = ({ item }: { item: any }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const isActive = pathname === item.href;

  if (item.submenu) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-between hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium",
              isOpen && "bg-slate-100 text-primary dark:bg-slate-800"
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </div>
            <div className="flex items-center gap-1">
              {item.badge && (
                <Badge className="bg-green-100 text-green-600 hover:bg-green-100 border-none h-5 px-1.5 text-[10px]">
                  {item.badge}
                </Badge>
              )}
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isOpen ? "rotate-180" : ""
                )}
              />
            </div>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-9 space-y-1 mt-1">
          {item.submenu.map((subItem: any, index: number) => (
            <Link
              key={index}
              href={subItem.href}
              className="block py-2 text-sm text-slate-500 hover:text-primary transition-colors"
            >
              {subItem.title}
            </Link>
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "w-full justify-start gap-3 hover:bg-slate-100 text-slate-600 dark:text-slate-300 font-medium rounded-none",
        isActive && "bg-slate-100 text-primary"
      )}
    >
      <Link href={item.href}>
        <item.icon className="h-5 w-5" />
        <span>{item.title}</span>
        {item.badge && (
          <Badge className="ml-auto bg-green-100 text-green-600 hover:bg-green-100 border-none h-5 px-1.5 text-[10px]">
            {item.badge}
          </Badge>
        )}
      </Link>
    </Button>
  );
};

export function AdminSidebar() {
  return (
    <div className="h-screen w-[280px] border-r bg-white dark:bg-slate-950 flex flex-col">
      {/* HEADER LOGO */}
      <div className=" p-6 flex items-center justify-center">
        <img src="/dark-logo.png" alt="" className="" />
      </div>

      <ScrollArea className="flex-1 px-4 py-4">
        <div className="space-y-6">
          {sidebarData.map((group, index) => (
            <div key={index}>
              <h3 className="mb-4 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {group.group}
              </h3>
              <div className="space-y-1">
                {group.items.map((item, itemIndex) => (
                  <MenuItem key={itemIndex} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
