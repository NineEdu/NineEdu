// components/QuizPlayer.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle, RotateCcw, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import useSubmitQuizz from "@/hooks/quizs/useSubmitQuiz";

interface QuizPlayerProps {
  quiz: any;
  onPassed: () => void;
  onCancel: () => void;
}

export default function QuizPlayer({
  quiz,
  onPassed,
  onCancel,
}: QuizPlayerProps) {
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);

  const { submitQuizz, isPending: isSubmitting } = useSubmitQuizz({});

  useEffect(() => {
    if (quiz?.questions) {
      setAnswers(new Array(quiz.questions.length).fill(""));
      setResult(null);
    }
  }, [quiz]);

  const handleSelectOption = (qIndex: number, val: string) => {
    if (result) return;
    const newAns = [...answers];
    newAns[qIndex] = val;
    setAnswers(newAns);
  };

  const handleSubmit = async () => {
    if (answers.some((a) => a === "")) {
      alert("Please answer all questions.");
      return;
    }

    const res = await submitQuizz({
      quizId: quiz._id,
      answers: answers,
    });

    //@ts-ignore
    if (res && res.score !== undefined) {
      setResult(res);
      //@ts-ignore
      if (res.passed) {
        onPassed();
      }
    }
  };

  const handleRetry = () => {
    setAnswers(new Array(quiz.questions.length).fill(""));
    setResult(null);
  };

  if (result) {
    return (
      <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-white border rounded-xl p-8 text-center space-y-6">
        <div className="mx-auto w-24 h-24 rounded-full flex items-center justify-center bg-slate-50">
          {result.passed ? (
            <CheckCircle className="w-16 h-16 text-green-500" />
          ) : (
            <XCircle className="w-16 h-16 text-red-500" />
          )}
        </div>

        <div>
          <h2
            className={cn(
              "text-2xl font-bold",
              result.passed ? "text-green-600" : "text-red-600"
            )}
          >
            {result.passed ? "Excellent!" : "Keep Trying"}
          </h2>
          <p className="text-slate-500 mt-2">
            Score:{" "}
            <span className="font-bold text-slate-900">
              {result.score}/{result.total}
            </span>
          </p>
          <p className="text-sm text-slate-400 mt-1">
            Passing score: {quiz.passingScore}/{quiz.questions.length}
          </p>
        </div>

        <div className="flex gap-4">
          {!result.passed && (
            <Button variant="outline" onClick={handleRetry}>
              <RotateCcw className="w-4 h-4 mr-2" /> Try Again
            </Button>
          )}
          <Button onClick={onCancel} variant="ghost">
            Back to Lesson
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="bg-indigo-50 p-4 rounded-xl flex justify-between items-center border border-indigo-100">
        <h2 className="font-bold text-indigo-900">
          {quiz.title || "Lesson Quiz"}
        </h2>
        <span className="text-xs font-bold bg-white text-indigo-600 px-3 py-1 rounded-full shadow-sm">
          {answers.filter((a) => a !== "").length}/{quiz.questions.length}{" "}
          Answered
        </span>
      </div>

      <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
        {quiz.questions.map((q: any, idx: number) => (
          <Card key={q._id} className="p-5 border-slate-200 shadow-sm">
            <h3 className="font-semibold text-base mb-4 flex gap-3">
              <span className="text-slate-400">#{idx + 1}</span>{" "}
              {q.questionText}
            </h3>
            <RadioGroup
              value={answers[idx]}
              onValueChange={(val) => handleSelectOption(idx, val)}
              className="space-y-3"
            >
              {q.options.map((opt: string, optIdx: number) => (
                <div
                  key={optIdx}
                  className={cn(
                    "flex items-center space-x-3 border rounded-lg p-3 cursor-pointer hover:bg-slate-50 transition-all",
                    answers[idx] === opt && "border-indigo-600 bg-indigo-50"
                  )}
                  onClick={() => handleSelectOption(idx, opt)}
                >
                  <RadioGroupItem value={opt} id={`q${idx}-${optIdx}`} />
                  <Label
                    htmlFor={`q${idx}-${optIdx}`}
                    className="flex-1 cursor-pointer font-normal text-slate-700"
                  >
                    {opt}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </Card>
        ))}
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-indigo-600 hover:bg-indigo-700 min-w-[120px]"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </div>
  );
}
