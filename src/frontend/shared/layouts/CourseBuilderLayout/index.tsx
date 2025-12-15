import React from "react";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/Text";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";

interface CourseBuilderLayoutProps {
  children: React.ReactNode;

  // Header Props
  title: string;
  stepCurrent?: number;
  stepTotal?: number;

  // Footer Props
  backLabel?: string;
  onBack?: () => void;

  nextLabel?: string;
  onNext?: () => void;
  isNextLoading?: boolean;

  // Tắt footer nếu muốn custom riêng
  hideFooter?: boolean;
}

const CourseBuilderLayout: React.FC<CourseBuilderLayoutProps> = ({
  children,
  title,
  stepCurrent = 1,
  stepTotal = 2,
  backLabel = "Back",
  onBack,
  nextLabel = "Finish & Publish",
  onNext,
  isNextLoading = false,
  hideFooter = false,
}) => {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-24 flex flex-col">
      {/* --- HEADER (Fixed) --- */}
      <header className="sticky top-0 z-40 w-full border-b bg-white px-6 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold text-sm">
            {stepCurrent}
          </div>
          <Text className="font-bold text-lg text-slate-800">{title}</Text>
        </div>

        {/* Progress Bar nhỏ ở Header */}
        <div className="hidden md:flex items-center gap-1">
          {Array.from({ length: stepTotal }).map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 w-8 rounded-full ${
                idx + 1 <= stepCurrent ? "bg-indigo-600" : "bg-slate-200"
              }`}
            />
          ))}
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 w-full">{children}</main>

      {/* --- FOOTER (Fixed Bottom) --- */}
      {!hideFooter && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-2 md:px-6">
            <Button
              variant="outline"
              onClick={onBack}
              className="rounded-full px-6 h-11 border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {backLabel}
            </Button>

            <Button
              onClick={onNext}
              disabled={isNextLoading}
              className="rounded-full px-8 h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-200 transition-all hover:scale-105"
            >
              {isNextLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-5 w-5" /> {nextLabel}
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseBuilderLayout;
