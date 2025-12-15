"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { MessageCircle, Search, MessagesSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import useGetConversations from "@/hooks/conversations/useGetConversations";
import useCreateConversation from "@/hooks/conversations/useCreateConversation";

import ConversationItem from "@/components/ConversationItem";
import ConversationForm from "@/components/ConversationForm";

export default function CourseConversationsPage() {
  const params = useParams();
  const courseId = params?.courseId as string;
  const [searchTerm, setSearchTerm] = useState("");

  // fetch data
  const { data: conversations, isLoading } = useGetConversations({
    queryKey: ["getConversations", courseId],
    queryParams: { courseId },
  });

  // create post mutation
  const { createConversation, isPending: isCreating } = useCreateConversation(
    {}
  );

  const handleCreatePost = async (content: string) => {
    await createConversation({
      courseId,
      content,
    });
  };

  // client-side filter
  const filteredConversations = conversations?.filter(
    (item: any) =>
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.userId.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        {/* header section */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <MessageCircle className="w-8 h-8" />
                Q&A & Discussions
              </h1>
              <p className="text-slate-500 mt-1">
                Exchange knowledge, ask questions, and share ideas with
                instructors and students.
              </p>
            </div>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search discussions..."
                className="pl-10 bg-white shadow-sm border-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* create post section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <MessagesSquare className="w-5 h-5 text-indigo-500" />
            Start a new discussion
          </h2>
          <ConversationForm
            onSubmit={handleCreatePost}
            isSubmitting={isCreating}
            placeholder="What's on your mind? Share with everyone..."
            submitLabel="Post"
          />
        </div>

        {/* conversation list */}
        <div className="space-y-6">
          {isLoading ? (
            // loading skeletons
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl border space-y-4 shadow-sm"
              >
                <div className="flex gap-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="w-32 h-4" />
                    <Skeleton className="w-20 h-3" />
                  </div>
                </div>
                <Skeleton className="w-full h-16 rounded-lg" />
              </div>
            ))
          ) : filteredConversations?.length > 0 ? (
            // render items
            filteredConversations.map((item: any) => (
              <ConversationItem key={item._id} conversation={item} />
            ))
          ) : (
            // empty state
            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-slate-900 font-bold text-lg">
                No discussions yet
              </h3>
              <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                It's quiet here. Be the first to ask a question!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
