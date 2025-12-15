"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  title = "Bạn có chắc chắn không?",
  description = "Hành động này không thể hoàn tác. Dữ liệu sẽ bị xóa vĩnh viễn khỏi hệ thống.",
  confirmText = "Xác nhận",
  cancelText = "Hủy bỏ",
  variant = "destructive",
}) => {
  const handleOpenChange = (open: boolean) => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {variant === "destructive" && (
              <Trash2 className="w-5 h-5 text-red-600" />
            )}
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading} onClick={onClose}>
            {cancelText}
          </AlertDialogCancel>

          <Button
            disabled={loading}
            variant={variant}
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
