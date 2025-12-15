"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, X } from "lucide-react";

interface LessonCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  isLastLesson?: boolean;
}

export const LessonCompleteModal = ({
  isOpen,
  onClose,
  onNext,
  isLastLesson,
}: LessonCompleteModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader className="flex flex-col items-center gap-4 pt-4">
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <DialogTitle className="text-2xl font-bold text-green-700">
            Xin chúc mừng!
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Bạn đã hoàn thành bài học này. Hãy tiếp tục giữ vững phong độ nhé!
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4 w-full">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-1/2"
          >
            Ở lại đây
          </Button>
          {!isLastLesson && (
            <Button
              onClick={() => {
                onClose();
                onNext();
              }}
              className="w-full sm:w-1/2 bg-indigo-600 hover:bg-indigo-700 gap-2"
            >
              Bài tiếp theo <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
