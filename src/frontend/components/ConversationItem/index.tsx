"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, Trash2, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ConversationForm from "../ConversationForm";

import useReplyConversation from "@/hooks/conversations/useReplyConversation";
import useDeleteConversation from "@/hooks/conversations/useDeleteConversation";
import { useCurrentUser } from "@/hooks/useAuth";

export default function ConversationItem({
  conversation,
}: {
  conversation: any;
}) {
  const [isReplying, setIsReplying] = useState(false);
  const { data: currentUser } = useCurrentUser();

  // mutations
  const { replyConversation, isPending: isReplyingPending } =
    useReplyConversation({});
  const { deleteConversation } = useDeleteConversation({});

  const isOwner = currentUser?._id === conversation.userId._id;

  // handle reply submit
  const handleReply = async (content: string) => {
    await replyConversation({
      conversationId: conversation._id,
      content,
    });
    setIsReplying(false);
  };

  // handle delete post
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this discussion?")) {
      await deleteConversation({ conversationId: conversation._id });
    }
  };

  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
      {/* header section */}
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <Avatar>
            <AvatarImage src={conversation.userId.avatar} />
            <AvatarFallback>{conversation.userId.fullName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-semibold text-sm text-slate-900">
              {conversation.userId.fullName}
              {conversation.userId.role === "instructor" && (
                <span className="ml-2 text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-bold uppercase">
                  Instructor
                </span>
              )}
            </h4>
            <p className="text-xs text-slate-500">
              {formatDistanceToNow(new Date(conversation.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>

        {/* owner actions menu */}
        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* main content */}
      <div className="pl-[52px]">
        {conversation.title && (
          <h3 className="font-bold text-lg mb-2 text-slate-900">
            {conversation.title}
          </h3>
        )}
        {/* render html content */}
        <div
          className="text-slate-700 leading-relaxed text-sm prose prose-sm max-w-none 
            prose-p:my-1 prose-ul:my-1 prose-ul:list-disc prose-ol:list-decimal 
            prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:italic
            prose-img:rounded-lg prose-a:text-indigo-600 prose-a:underline"
          dangerouslySetInnerHTML={{ __html: conversation.content }}
        />
      </div>

      {/* action buttons */}
      <div className="pl-[52px] flex items-center gap-4 pt-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-500 hover:text-indigo-600 px-0 hover:bg-transparent"
          onClick={() => setIsReplying(!isReplying)}
        >
          <MessageSquare className="w-4 h-4 mr-1.5" />
          {conversation.replies.length > 0
            ? `${conversation.replies.length} Replies`
            : "Reply"}
        </Button>
      </div>

      {/* replies area */}
      <div className="pl-[52px] space-y-4 mt-2">
        {/* reply form */}
        {isReplying && (
          <div className="animate-in fade-in slide-in-from-top-2 mb-6">
            <ConversationForm
              onSubmit={handleReply}
              isSubmitting={isReplyingPending}
              placeholder="Write your reply..."
              submitLabel="Reply"
              onCancel={() => setIsReplying(false)}
            />
          </div>
        )}

        {/* replies list */}
        {conversation.replies.length > 0 && (
          <div className="space-y-4 border-t pt-4">
            {conversation.replies.map((reply: any) => (
              <div key={reply._id} className="flex gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={reply.userId.avatar} />
                  <AvatarFallback className="text-xs">
                    {reply.userId.fullName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="bg-slate-50 p-3 rounded-xl rounded-tl-none flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-slate-900">
                      {reply.userId.fullName}
                    </span>
                    <span className="text-xs text-slate-400">
                      {formatDistanceToNow(new Date(reply.createdAt))}
                    </span>
                  </div>
                  <div
                    className="text-sm text-slate-700 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: reply.content }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
