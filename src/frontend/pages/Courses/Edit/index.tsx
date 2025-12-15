"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Plus,
  Video,
  FileText,
  Trash2,
  GripVertical,
  Clock,
  Loader2,
  Save,
  LinkIcon,
  UploadCloud,
  X,
  File,
  BrainCircuit,
} from "lucide-react";

// drag and drop imports
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

// ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";

// custom hooks
import useGetLessonsByCourse from "@/hooks/lessons/useGetLessonsByCourse";
import useAddLesson from "@/hooks/lessons/useAddLesson";
import useDeleteLesson from "@/hooks/lessons/useDeleteLesson";
import useUpdateLesson from "@/hooks/lessons/useUpdateLesson";
import useReorderLessons from "@/hooks/lessons/useReorderLessons";
import { ConfirmModal } from "@/modals/ConfirmModals";
import useModal from "@/modals/useModal";
import { useQueryClient } from "@tanstack/react-query";
import VideoPlayer from "@/components/VideoPlayer";
import { UploadV3 } from "@/shared/components/UploadV3";
import { TextareaField } from "@/shared/components/TextareaField";
import { QuizSetupForm } from "@/components/QuizSetupForm";

// validation schema
export const lessonSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().max(1000, "Title max 1000 characters"),
  videoUrl: z.string().optional().or(z.literal("")),
  isPublished: z.boolean().optional(),
  resources: z
    .array(
      z.object({
        name: z.string().min(1, "Name is required"),
        url: z.string().min(1, "Url is required"),
      })
    )
    .optional(),
});

type LessonFormValues = z.infer<typeof lessonSchema>;

// resource item component
const ResourceItem = ({
  index,
  remove,
  register,
  control,
  errors,
  watch,
}: any) => {
  const [inputType, setInputType] = useState<"url" | "upload">("url");
  const currentValue = watch(`resources.${index}.url`);

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase">
          Resource #{index + 1}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => remove(index)}
          className="h-6 w-6 p-0 text-red-500 hover:bg-red-50 rounded-full"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-1">
        <Label className="text-xs text-slate-600">Display Name</Label>
        <Input
          {...register(`resources.${index}.name`)}
          placeholder="e.g. Download VS Code..."
          className="h-8 bg-white"
        />
        {errors?.resources?.[index]?.name && (
          <span className="text-[10px] text-red-500">
            {errors.resources[index].name.message}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-slate-600">File Source</Label>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setInputType("url")}
              className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-all ${
                inputType === "url"
                  ? "bg-white border-slate-300 text-indigo-600"
                  : "border-transparent text-slate-400"
              }`}
            >
              Link
            </button>
            <button
              type="button"
              onClick={() => setInputType("upload")}
              className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-all ${
                inputType === "upload"
                  ? "bg-white border-slate-300 text-indigo-600"
                  : "border-transparent text-slate-400"
              }`}
            >
              Upload
            </button>
          </div>
        </div>

        {inputType === "url" && (
          <div className="relative">
            <LinkIcon className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
            <Input
              {...register(`resources.${index}.url`)}
              placeholder="https://..."
              className="h-8 pl-8 bg-white"
            />
          </div>
        )}

        {inputType === "upload" && (
          <UploadV3
            control={control}
            name={`resources.${index}.url`}
            maxSize={50}
            className="bg-white rounded-md"
          >
            {({ value, isUploading }, { onBrowse, onRemove }) => (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onBrowse}
                  disabled={isUploading}
                  className="h-8 w-full justify-start text-slate-600"
                >
                  {isUploading ? (
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  ) : (
                    <UploadCloud className="mr-2 h-3 w-3" />
                  )}
                  {value ? "Change File" : "Choose File"}
                </Button>
                {value && (
                  <div className="flex-1 flex items-center justify-between px-2 py-1 bg-indigo-50 border border-indigo-100 rounded text-xs text-indigo-700 truncate">
                    <span className="truncate max-w-[100px]">
                      {value.split("/").pop()}
                    </span>
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-red-500"
                      onClick={onRemove}
                    />
                  </div>
                )}
              </div>
            )}
          </UploadV3>
        )}
      </div>
    </div>
  );
};

// lesson item component
const LessonItem = ({ lesson, index, provided, isDragging }: any) => {
  const params = useParams();
  const courseId = params?.courseId as string;
  const queryClient = useQueryClient();

  const [inputType, setInputType] = useState<"url" | "upload">("url");
  const [isPreview, setIsPreview] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: lesson.title || "",
      content: lesson.content || "",
      videoUrl: lesson.videoUrl || "",
      isPublished: !!lesson.isPublished,
      resources: lesson.resources || [],
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    control,
    formState: { isDirty, errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "resources",
  });

  React.useEffect(() => {
    reset({
      title: lesson.title || "",
      content: lesson.content || "",
      videoUrl: lesson.videoUrl || "",
      isPublished: !!lesson.isPublished,
      resources: lesson.resources || [],
    });

    if (
      lesson.videoUrl &&
      !lesson.videoUrl.includes("youtu") &&
      !lesson.videoUrl.includes("vimeo")
    ) {
      setInputType("upload");
    }
  }, [lesson, reset]);

  const { show: showConfirmModal } = useModal(ConfirmModal);

  //@ts-ignore
  const { deleteLesson } = useDeleteLesson({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons", courseId] });
    },
  });

  //@ts-ignore
  const { updateLesson } = useUpdateLesson({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons", courseId] });
    },
  });

  const onSubmit = (data: LessonFormValues) => {
    updateLesson({ lessonId: lesson._id, dataToUpdate: data });
  };

  return (
    <AccordionItem
      value={lesson._id}
      ref={provided.innerRef}
      {...provided.draggableProps}
      className={`border border-slate-200 rounded-xl px-4 data-[state=open]:border-indigo-600 bg-white mb-4 ${
        isDragging ? "shadow-lg border-indigo-400 bg-indigo-50 z-50" : ""
      }`}
    >
      <AccordionTrigger className="hover:no-underline py-4">
        <div className="flex items-center gap-3 w-full pr-4">
          <div
            {...provided.dragHandleProps}
            className="cursor-grab hover:text-slate-600 active:cursor-grabbing p-1"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-5 w-5 text-slate-300" />
          </div>

          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
            {index + 1}
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-bold text-slate-900">{lesson.title}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] text-slate-400 flex items-center mr-3">
                <Clock className="h-3 w-3 mr-1" /> {lesson.duration || "00:00"}
              </span>
              {lesson.resources?.length > 0 && (
                <span className="text-[10px] text-slate-400 flex items-center">
                  <File className="h-3 w-3 mr-1" /> {lesson.resources.length}{" "}
                  Attachments
                </span>
              )}
            </div>
          </div>
          <div
            className={`h-2 w-2 rounded-full ${
              watch("isPublished") ? "bg-green-500" : "bg-slate-300"
            }`}
          />
        </div>
      </AccordionTrigger>

      <AccordionContent className="pb-4 pt-2 border-t border-slate-100 mt-2">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pl-11">
          {/* title field */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase">
              Lesson Title
            </Label>
            <Input
              {...register("title")}
              className={`h-10 border-slate-200 ${
                errors.title ? "border-red-500 focus-visible:ring-red-500" : ""
              }`}
            />
            {errors.title && (
              <span className="text-red-500 text-xs">
                {errors.title.message}
              </span>
            )}
          </div>

          {/* content field */}
          <TextareaField
            control={control}
            name="content"
            maxLength={1000}
            label="LESSON DESCRIPTION"
            showCount
          />

          {/* video section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-slate-500 uppercase">
                Video Content
              </Label>
              <div className="bg-slate-100 p-1 rounded-lg flex gap-1">
                <button
                  type="button"
                  onClick={() => setInputType("url")}
                  className={`px-3 py-1 rounded-md text-[10px] font-semibold transition-all flex items-center gap-1 ${
                    inputType === "url"
                      ? "bg-white shadow-sm text-indigo-600"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <LinkIcon className="h-3 w-3" /> URL
                </button>
                <button
                  type="button"
                  onClick={() => setInputType("upload")}
                  className={`px-3 py-1 rounded-md text-[10px] font-semibold transition-all flex items-center gap-1 ${
                    inputType === "upload"
                      ? "bg-white shadow-sm text-indigo-600"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <UploadCloud className="h-3 w-3" /> Upload
                </button>
              </div>
            </div>
            {inputType === "url" && (
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Video className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    {...register("videoUrl")}
                    placeholder="Youtube/Vimeo link..."
                    className="pl-9 h-10 border-slate-200"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsPreview(!isPreview)}
                  className={isPreview ? "bg-slate-100" : ""}
                >
                  Preview
                </Button>
              </div>
            )}
            {inputType === "upload" && (
              <div className="border rounded-xl p-1">
                <UploadV3
                  control={control}
                  name="videoUrl"
                  accept="video/*"
                  maxSize={500}
                >
                  {({ value, isUploading }, { onBrowse, onRemove }) =>
                    value ? (
                      <div className="space-y-2 p-2">
                        <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <span className="truncate text-sm">
                            {value.split("/").pop()}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={onRemove}
                            className="text-red-500 h-8 px-2"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <VideoPlayer url={value} />
                      </div>
                    ) : (
                      <div
                        onClick={onBrowse}
                        className="flex flex-col items-center justify-center gap-2 py-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-slate-50"
                      >
                        {isUploading ? (
                          <Loader2 className="animate-spin text-indigo-600" />
                        ) : (
                          <UploadCloud className="text-slate-400" />
                        )}
                        <p className="text-xs text-slate-500">
                          Upload Video (Max 500MB)
                        </p>
                      </div>
                    )
                  }
                </UploadV3>
              </div>
            )}
            {inputType === "url" && isPreview && watch("videoUrl") && (
              <VideoPlayer url={watch("videoUrl") as string} />
            )}
          </div>

          {/* resources section */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-500" />
                <Label className="text-xs font-bold text-slate-500 uppercase">
                  Resources ({fields.length})
                </Label>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ name: "", url: "" })}
                className="h-7 text-xs border-dashed"
              >
                <Plus className="h-3 w-3 mr-1" /> Add
              </Button>
            </div>
            <div className="space-y-3">
              {fields.map((field, index) => (
                <ResourceItem
                  key={field.id}
                  index={index}
                  remove={remove}
                  register={register}
                  control={control}
                  errors={errors}
                  watch={watch}
                />
              ))}
            </div>
          </div>

          {/* action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center">
              <Dialog open={isQuizOpen} onOpenChange={setIsQuizOpen}>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                  >
                    <BrainCircuit className="h-4 w-4 mr-2" />
                    Manage Quiz
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-none w-[70vw] max-w-6xl h-[90vh] max-h-[90vh] !p-0 flex flex-col bg-white overflow-hidden">
                  <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle>Setup Lesson Quiz</DialogTitle>
                  </DialogHeader>
                  <div className="flex-1 overflow-y-auto p-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <QuizSetupForm
                      lessonId={lesson._id}
                      courseId={courseId}
                      lessonTitle={lesson.title}
                      onSuccess={() => {}}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex items-center gap-2">
              {isDirty && (
                <Button
                  type="submit"
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Save className="h-3 w-3 mr-1" /> Save
                </Button>
              )}
              <div className="flex items-center gap-2 ml-2 border-l pl-4 border-slate-200">
                <Switch
                  checked={watch("isPublished")}
                  onCheckedChange={(val) =>
                    setValue("isPublished", val, { shouldDirty: true })
                  }
                />
                <Label className="text-xs text-slate-600">Publish</Label>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-red-600"
                onClick={() => {
                  showConfirmModal({
                    title: "Delete Lesson",
                    content: `Are you sure...?`,
                    labels: { cancel: "Cancel", action: "Delete" },
                    onAction: async () =>
                      await deleteLesson({ lessonId: lesson._id }),
                    async: true,
                  });
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>
      </AccordionContent>
    </AccordionItem>
  );
};

// main page component
export default function CourseCurriculumPage() {
  const queryClient = useQueryClient();
  const params = useParams();
  const courseId = params?.courseId as string;
  const [isMounted, setIsMounted] = useState(false);

  const { data: lessons = [], isLoading: isFetching } = useGetLessonsByCourse({
    queryKey: ["lessons", courseId],
    queryParams: { courseId },
  });

  const [items, setItems] = useState<any[]>([]);

  const { reorderLessons, isPending: isReordering } = useReorderLessons({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons", courseId] });
    },
  });

  useEffect(() => {
    setItems(lessons);
  }, [lessons]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  //@ts-ignore
  const { addLesson, mutation: addLessonMutation } = useAddLesson({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons", courseId] });
    },
  });

  const createLessonForm = useForm<{ title: string }>({
    resolver: zodResolver(z.object({ title: lessonSchema.shape.title })),
    defaultValues: { title: "" },
  });
  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    formState: { errors: createErrors },
  } = createLessonForm;

  const onAddLesson = (data: { title: string }) => {
    addLesson({ courseId, title: data.title });
    resetCreate();
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(sourceIndex, 1);
    newItems.splice(destinationIndex, 0, reorderedItem);

    setItems(newItems);

    const bulkUpdateData = newItems.map((lesson, index) => ({
      _id: lesson._id,
      order: index + 1,
    }));

    reorderLessons({
      courseId,
      lessonsList: bulkUpdateData,
    });
  };

  if (!isMounted) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Card className="shadow-sm border-slate-200 min-h-[500px]">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Lessons ({items.length})
            </h2>
            {isReordering && (
              <span className="text-xs text-indigo-500 animate-pulse flex items-center">
                <Loader2 className="h-3 w-3 mr-1 animate-spin" /> Saving
                order...
              </span>
            )}
          </div>

          {isFetching && (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin" />
            </div>
          )}

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="lessons-list">
              {(provided) => (
                <Accordion
                  type="single"
                  collapsible
                  className="w-full space-y-4"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {items.map((lesson: any, index: number) => (
                    <Draggable
                      key={lesson._id}
                      draggableId={lesson._id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <LessonItem
                          lesson={lesson}
                          index={index}
                          provided={provided}
                          isDragging={snapshot.isDragging}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Accordion>
              )}
            </Droppable>
          </DragDropContext>

          <form
            onSubmit={handleSubmitCreate(onAddLesson)}
            className="mt-6 p-4 bg-slate-50 rounded-xl border border-dashed hover:border-indigo-400 transition-all"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-white border flex items-center justify-center">
                  {addLessonMutation?.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </div>
                <Input
                  {...registerCreate("title")}
                  placeholder="Enter new lesson title..."
                  className="flex-1 bg-transparent border-none shadow-none focus-visible:ring-0"
                  disabled={addLessonMutation?.isPending}
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={addLessonMutation?.isPending}
                  className="bg-indigo-600 text-white rounded-full"
                >
                  Add
                </Button>
              </div>
              {createErrors.title && (
                <span className="text-[10px] text-red-500 pl-11">
                  {createErrors.title.message}
                </span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
