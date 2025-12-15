"use client";

import { Button } from "@/components/ui/button";
import { LogOut, Eye } from "lucide-react";
import Link from "next/link";

export const CourseNavbar = () => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm z-50">
      <div className="flex gap-x-2 ml-auto">
        {/* exit */}
        <Link href="/admin/courses">
          <Button size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Exit
          </Button>
        </Link>
      </div>
    </div>
  );
};
