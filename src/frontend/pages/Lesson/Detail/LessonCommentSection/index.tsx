"use client";

import React from "react";
import { MessageSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import useGetConversations from "@/hooks/conversations/useGetConversations";
import useCreateConversation from "@/hooks/conversations/useCreateConversation";

import ConversationItem from "@/components/ConversationItem";
import ConversationForm from "@/components/ConversationForm";

interface LessonCommentSectionProps {
  courseId: string;
  lessonId: string;
}

export default function LessonCommentSection({
  courseId,
  lessonId,
}: LessonCommentSectionProps) {
  // fetch conversations
  const { data: conversations, isLoading } = useGetConversations({
    queryKey: ["getConversations", courseId, lessonId],
    queryParams: { courseId, lessonId },
  });

  // create mutation
  const { createConversation, isPending: isCreating } = useCreateConversation(
    {}
  );

  const handleCreatePost = async (content: string) => {
    await createConversation({
      courseId,
      lessonId,
      content,
    });
  };

  return (
    <div className="space-y-6 mt-8 border-t pt-8">
      <h3 className="text-xl font-bold flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-black" />
        Lesson Discussion
      </h3>

      {/* discussion form */}
      <ConversationForm
        onSubmit={handleCreatePost}
        isSubmitting={isCreating}
        placeholder="Ask a question about this lesson..."
        submitLabel="Post Question"
      />

      {/* discussion list */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        ) : conversations?.length > 0 ? (
          conversations.map((item: any) => (
            <ConversationItem key={item._id} conversation={item} />
          ))
        ) : (
          <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg">
            No discussions yet for this lesson.
          </div>
        )}
      </div>
    </div>
  );
}
