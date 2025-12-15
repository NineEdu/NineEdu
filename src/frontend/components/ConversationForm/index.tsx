"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import TiptapEditor from "@/components/TiptapEditor"; // Đường dẫn file vừa tạo

interface ConversationFormProps {
  onSubmit: (content: string) => Promise<any>;
  isSubmitting?: boolean;
  placeholder?: string;
  onCancel?: () => void;
  submitLabel?: string;
}

export default function ConversationForm({
  onSubmit,
  isSubmitting = false,
  placeholder = "Chia sẻ suy nghĩ của bạn...",
  onCancel,
  submitLabel = "Gửi",
}: ConversationFormProps) {
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    // Check nếu chỉ có thẻ HTML rỗng (vd: <p></p>)
    if (!content || content === "<p></p>") return;

    await onSubmit(content);
    setContent(""); // TiptapEditor sẽ tự clear nhờ useEffect lắng nghe content
    if (onCancel) onCancel();
  };

  return (
    <div className="space-y-3">
      <TiptapEditor
        content={content}
        onChange={(html) => setContent(html)}
        placeholder={placeholder}
        disabled={isSubmitting}
      />

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            Hủy
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !content || content === "<p></p>"}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Send className="w-4 h-4 mr-2" />
          )}
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
