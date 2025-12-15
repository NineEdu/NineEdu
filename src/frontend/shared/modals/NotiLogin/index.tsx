"use client";

import React from "react";
import Link from "next/link";
import { Lock, LogIn, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const NotiLogin = ({ modalState }: { modalState: any }) => {
  return (
    <Dialog {...modalState}>
      {/* Nội dung Dialog */}
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <Lock className="h-6 w-6 text-slate-500" />
          </div>
          <DialogTitle className="text-xl">Authentication Required</DialogTitle>
          <DialogDescription className="text-center pt-2">
            You need to be logged in to perform this action. Please log in or
            create an account to continue.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-4">
          {/* Login Button - Mở tab mới */}
          <Link
            href="/login"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700">
              <LogIn className="h-4 w-4" />
              Log in
            </Button>
          </Link>

          {/* Register Button - Mở tab mới */}
          <Link
            href="/register"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button variant="outline" className="w-full gap-2">
              <UserPlus className="h-4 w-4" />
              Create an account
            </Button>
          </Link>
        </div>

        <DialogFooter className="sm:justify-center">
          <p className="text-xs text-muted-foreground text-center">
            The page will remain open while you verify your account.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotiLogin;
