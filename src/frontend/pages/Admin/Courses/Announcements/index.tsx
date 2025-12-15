"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Megaphone,
  Plus,
  Loader2,
  CalendarDays,
  User,
  Send,
  BellOff,
} from "lucide-react";

// --- UI COMPONENTS ---
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

// --- HOOKS ---
import useGetAnnouncements from "@/hooks/announcements/useGetAnnouncements";
import useCreateAnnouncement from "@/hooks/announcements/useCreateAnnouncement";
import { useCurrentUser } from "@/hooks/useAuth";
import formatDate from "@/utils/formatData";

// --- SCHEMA ---
const formSchema = z.object({
  title: z.string().min(5, "Tiêu đề ít nhất 5 ký tự").max(100),
  content: z.string().min(10, "Nội dung ít nhất 10 ký tự"),
});

type AnnouncementFormValues = z.infer<typeof formSchema>;


export default function AnnouncementsPage() {
  const params = useParams();
  const courseId = params?.courseId as string;
  const { data: user } = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);

  // --- API HOOKS ---
  const { data: announcements = [], isLoading } = useGetAnnouncements({
    queryParams: {
      courseId,
    },
  });
  //@ts-ignore
  const { createAnnouncement, isPending } = useCreateAnnouncement();

  // --- FORM ---
  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  // --- HANDLER ---
  const onSubmit = (values: AnnouncementFormValues) => {
    createAnnouncement({
      courseId,
      ...values,
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-indigo-600" /> Thông báo lớp học
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Gửi cập nhật quan trọng, tin tức hoặc tài liệu bổ sung cho tất cả
            học viên.
          </p>
        </div>

        {/* CREATE BUTTON (TRIGGER MODAL) */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#020080] hover:bg-blue-900 shadow-lg shadow-blue-900/10">
              <Plus className="w-4 h-4 mr-2" /> Tạo thông báo mới
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Tạo thông báo mới</DialogTitle>
              <DialogDescription>
                Thông báo sẽ được gửi email đến tất cả học viên đã đăng ký khóa
                học này.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 py-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiêu đề</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="VD: Cập nhật bài học mới..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nội dung chi tiết</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Nhập nội dung thông báo..."
                          className="min-h-[150px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    {isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    Gửi ngay
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Separator />

      {/* CONTENT SECTION */}
      <div className="space-y-6">
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mb-2 text-indigo-600" />
            <p>Đang tải dữ liệu...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && announcements.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <BellOff className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              Chưa có thông báo nào
            </h3>
            <p className="text-slate-500 max-w-sm mt-1 mb-6">
              Hãy tạo thông báo đầu tiên để chào mừng học viên hoặc chia sẻ lộ
              trình học tập.
            </p>
            <Button variant="outline" onClick={() => setIsOpen(true)}>
              Tạo thông báo đầu tiên
            </Button>
          </div>
        )}

        {/* List Announcements */}
        <div className="grid gap-6">
          {announcements.map((item: any) => (
            <Card
              key={item._id}
              className="shadow-sm border-slate-200 hover:border-indigo-200 transition-all"
            >
              <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
                <Avatar className="h-10 w-10 border border-slate-100">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-indigo-50 text-indigo-700 font-bold">
                    {user?.fullName?.[0] || "GV"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-slate-900">
                      {item.title}
                    </CardTitle>
                    <span className="text-xs text-slate-400 flex items-center bg-slate-50 px-2 py-1 rounded-full border">
                      <CalendarDays className="w-3 h-3 mr-1" />
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                  <CardDescription className="flex items-center gap-1 mt-1 text-xs">
                    <User className="w-3 h-3" />
                    Đăng bởi:{" "}
                    <span className="font-semibold text-indigo-600">
                      {user?.fullName || "Giảng viên"}
                    </span>
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent>
                <div className="pl-14 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {item.content}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
