"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Calendar,
  Shield,
  ArrowLeft,
  MapPin,
  Link as LinkIcon,
  MessageCircle,
  MoreHorizontal,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import useGetPublicUser from "@/hooks/users/useGetPublicUser";

export default function UserPublicProfile() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.userId;

  // fetch data
  const {
    data: user,
    isLoading,
    isError,
  } = useGetPublicUser({ queryParams: { userId } });

  // loading state
  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-3" />
        <p className="text-slate-400 font-medium text-sm animate-pulse">
          Loading profile...
        </p>
      </div>
    );
  }

  // error state
  if (isError || !user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white gap-4">
        <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center">
          <Shield className="h-10 w-10 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">User not found</h2>
        <p className="text-slate-500">
          This profile may have been deleted or does not exist.
        </p>
        <Button onClick={() => router.back()} className="rounded-full px-6">
          Go Back
        </Button>
      </div>
    );
  }

  // date formatter
  const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // role badge color
  const getRoleBadgeColor = (role: string) => {
    if (role === "admin") return "bg-red-500 text-white border-red-100";
    if (role === "instructor") return "bg-blue-500 text-white border-blue-100";
    return "bg-slate-500 text-white border-slate-200";
  };

  return (
    <div className="min-h-screen bg-white font-sans text-sm pb-20">
      {/* --- cover photo --- */}
      <div className="relative w-full h-[300px] md:h-[380px] bg-slate-900 overflow-hidden group">
        {/* background image*/}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{
            backgroundImage: `url(${user.avatar || "/placeholder-avatar.jpg"})`,
          }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-3xl"></div>
        </div>
      </div>

      {/* --- profile header --- */}
      <div className="w-full px-6 md:px-12 lg:px-20">
        <div className="relative -mt-[100px] mb-8 flex flex-col md:flex-row items-center md:items-end gap-8">
          {/* avatar */}
          <div className="relative shrink-0">
            <Avatar className="h-[180px] w-[180px] md:h-[200px] md:w-[200px] rounded-full border-[6px] border-white bg-white shadow-sm">
              <AvatarImage src={user.avatar} className="object-cover" />
              <AvatarFallback className="text-5xl font-bold bg-slate-50 text-slate-300">
                {user.fullName?.[0]}
              </AvatarFallback>
            </Avatar>
            {/* active status */}
            <span className="absolute bottom-6 right-6 h-6 w-6 bg-green-500 border-4 border-white rounded-full"></span>
          </div>

          {/* info & actions */}
          <div className="flex-1 text-center md:text-left mb-4 w-full">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center md:justify-start gap-2">
              {user.fullName}
              {user.role === "admin" && (
                <CheckCircle2 className="w-6 h-6 text-blue-500" />
              )}
            </h1>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-3 mt-3 text-slate-600">
              <Badge
                className={`text-xs px-3 py-1 rounded-full border font-semibold uppercase tracking-wide hover:bg-opacity-80 ${getRoleBadgeColor(
                  user.role
                )}`}
              >
                {user.role}
              </Badge>
              <span className="hidden md:inline text-slate-300">•</span>
              <div className="flex items-center gap-1.5 text-slate-500">
                <Calendar className="w-4 h-4" />
                <span>Joined {joinDate}</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-100 my-8" />

        {/* --- content layout --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* left sidebar: intro */}
          <div className="md:col-span-4 lg:col-span-3 space-y-8">
            <div className="bg-white">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Intro</h3>

              <div className="space-y-5 text-sm">
                {user.bio ? (
                  <p className="text-slate-600 text-center md:text-left leading-relaxed">
                    "{user.bio}"
                  </p>
                ) : (
                  <p className="text-slate-400 italic text-center md:text-left">
                    No bio yet.
                  </p>
                )}

                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-3 text-slate-700">
                    <Shield className="w-5 h-5 text-slate-400 shrink-0" />
                    <span>
                      Role:{" "}
                      <span className="font-semibold capitalize">
                        {user.role}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700">
                    <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                    <span>
                      From <span className="font-semibold">Vietnam</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700">
                    <LinkIcon className="w-5 h-5 text-slate-400 shrink-0" />
                    <a
                      href="#"
                      className="text-blue-600 hover:underline truncate"
                    >
                      nineedu.com/u/{userId?.slice(-6)}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* right content: tabs */}
          <div className="md:col-span-8 lg:col-span-9">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="bg-transparent p-0 mb-6 w-full justify-start border-b border-slate-100 gap-6">
                <TabsTrigger
                  value="about"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:text-black px-0 py-3 font-semibold text-slate-400 bg-transparent hover:text-slate-600 transition-all text-base"
                >
                  About
                </TabsTrigger>
                <TabsTrigger
                  value="courses"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:text-black px-0 py-3 font-semibold text-slate-400 bg-transparent hover:text-slate-600 transition-all text-base"
                >
                  Courses
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="about"
                className="animate-in fade-in duration-300 focus-visible:outline-none"
              >
                <div className="bg-white rounded-xl text-center py-20 border border-dashed border-slate-200">
                  <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    About {user.fullName}
                  </h3>
                  <p className="text-slate-500 mt-2 max-w-md mx-auto">
                    This user hasn't shared much information about themselves
                    yet.
                  </p>
                </div>
              </TabsContent>

              <TabsContent
                value="courses"
                className="animate-in fade-in duration-300 focus-visible:outline-none"
              >
                <div className="bg-white rounded-xl text-center py-20 border border-dashed border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900">
                    Enrolled Courses
                  </h3>
                  <p className="text-slate-500 mt-2">
                    Course information is private or hidden.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
