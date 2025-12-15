"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { MessageSquare, Search, PlusCircle, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

// hooks
import useGetConversations from "@/hooks/conversations/useGetConversations";
import useCreateConversation from "@/hooks/conversations/useCreateConversation";

// components
import ConversationItem from "@/components/ConversationItem";
import ConversationForm from "@/components/ConversationForm";

export default function AdminCourseConversationsPage() {
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
    <div className="p-6">
      <div className="space-y-6">
        {/* header & search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              Discussions
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Monitor student questions and engage with your community.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search topics..."
              className="pl-10 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* create new topic area */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <h2 className="font-semibold text-sm mb-3 flex items-center gap-2 text-slate-700">
            <PlusCircle className="w-4 h-4" />
            Post an announcement or discussion
          </h2>
          <ConversationForm
            onSubmit={handleCreatePost}
            isSubmitting={isCreating}
            placeholder="Share an update or start a topic with your students..."
            submitLabel="Post to Class"
          />
        </div>

        {/* conversation list */}
        <div className="space-y-4">
          {isLoading ? (
            // loading state
            [1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-xl border space-y-4">
                <div className="flex gap-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="w-32 h-4" />
                    <Skeleton className="w-20 h-3" />
                  </div>
                </div>
                <Skeleton className="w-full h-12 rounded-lg" />
              </div>
            ))
          ) : filteredConversations?.length > 0 ? (
            // render list
            filteredConversations.map((item: any) => (
              <ConversationItem key={item._id} conversation={item} />
            ))
          ) : (
            // empty state
            <div className="text-center py-12 bg-white rounded-xl border border-dashed">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-slate-900 font-medium">No discussions yet</h3>
              <p className="text-slate-500 text-sm mt-1">
                It's quiet here. Start a conversation to engage your students.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}