"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useForm } from "react-hook-form"; 
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Image as ImageIcon,
  Quote,
  Undo,
  Redo,
  UploadCloud,
  X,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; 
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { UploadV3 } from "@/shared/components/UploadV3";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const ImageInsertionDialog = ({
  open,
  onClose,
  onInsert,
}: {
  open: boolean;
  onClose: () => void;
  onInsert: (url: string) => void;
}) => {
  const { control, watch, setValue } = useForm<{ tempImage: string }>({
    defaultValues: { tempImage: "" },
  });

  const imageUrl = watch("tempImage");

  useEffect(() => {
    if (open) {
      setValue("tempImage", "");
    }
  }, [open, setValue]);

  const handleConfirm = () => {
    if (imageUrl) {
      onInsert(imageUrl);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Insert Image</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <UploadV3
            control={control}
            name="tempImage"
            label="Upload Image"
            className="w-full"
            children={(state, actions) => (
              <div
                onClick={actions.onBrowse}
                className={cn(
                  "relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors",
                  state.isDragging
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-slate-300",
                  state.value ? "border-solid border-indigo-200" : ""
                )}
              >
                {state.isUploading ? (
                  <div className="flex flex-col items-center text-slate-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
                    <p className="text-sm">Uploading...</p>
                  </div>
                ) : state.value ? (
                  <div className="relative w-full h-full p-2 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={state.value}
                      alt="Preview"
                      className="w-full h-full object-contain rounded-md"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        actions.onRemove();
                      }}
                      className="absolute top-3 right-3 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-slate-500">
                    <UploadCloud className="w-10 h-10 mb-2 text-slate-400" />
                    <p className="text-sm font-medium">
                      Click or drag image here
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      SVG, PNG, JPG, GIF (Max 20MB)
                    </p>
                  </div>
                )}
              </div>
            )}
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!imageUrl}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Check className="w-4 h-4 mr-2" /> Insert
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const TiptapEditor = ({
  content,
  onChange,
  placeholder = "Write something...",
  disabled = false,
}: TiptapEditorProps) => {
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension,
      Placeholder.configure({
        placeholder: placeholder,
        emptyEditorClass:
          "before:content-[attr(data-placeholder)] before:text-slate-400 before:float-left before:pointer-events-none before:h-0",
      }),
    ],
    content: content,
    editable: !disabled,
    immediatelyRender: false, 
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[120px] w-full rounded-b-md border-t-0 bg-transparent px-3 py-2 text-sm focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&_img]:rounded-md [&_img]:border [&_img]:border-slate-200 [&_img]:my-2",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content === "" && !editor.isEmpty) {
      editor.commands.clearContent();
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col border border-input rounded-md shadow-sm bg-white focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600 transition-all">
        <div className="flex flex-wrap items-center gap-1 p-1 border-b bg-slate-50/50 rounded-t-md">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            icon={<Bold className="w-4 h-4" />}
            label="Bold"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            icon={<Italic className="w-4 h-4" />}
            label="Italic"
          />
          <div className="w-px h-4 bg-slate-300 mx-1" />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            icon={<List className="w-4 h-4" />}
            label="Bullet List"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            icon={<ListOrdered className="w-4 h-4" />}
            label="Ordered List"
          />
          <div className="w-px h-4 bg-slate-300 mx-1" />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            icon={<Quote className="w-4 h-4" />}
            label="Quote"
          />
          {/* Nút Upload Ảnh */}
          <ToolbarButton
            onClick={() => setIsImageDialogOpen(true)}
            isActive={false}
            icon={<ImageIcon className="w-4 h-4" />}
            label="Insert Image"
          />
          <div className="ml-auto flex gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              isActive={false}
              icon={<Undo className="w-4 h-4" />}
              label="Undo"
              disabled={!editor.can().undo()}
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              isActive={false}
              icon={<Redo className="w-4 h-4" />}
              label="Redo"
              disabled={!editor.can().redo()}
            />
          </div>
        </div>

        <EditorContent editor={editor} className="w-full" />
      </div>

      <ImageInsertionDialog
        open={isImageDialogOpen}
        onClose={() => setIsImageDialogOpen(false)}
        onInsert={(url) => {
          editor.chain().focus().setImage({ src: url }).run();
        }}
      />
    </>
  );
};

const ToolbarButton = ({ onClick, isActive, icon, label, disabled }: any) => (
  <Button
    variant="ghost"
    size="sm"
    type="button" 
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
    disabled={disabled}
    className={cn(
      "h-8 w-8 p-0 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50",
      isActive && "bg-indigo-100 text-indigo-700"
    )}
    title={label}
  >
    {icon}
  </Button>
);

export default TiptapEditor;
