"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Save, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import { InputField } from "@/shared/components/InputField";
import { MultiSelectV2 } from "@/shared/components/MutiSelectV2";
import { UploadV2 } from "@/shared/components/UploadV2";

import { useCurrentUser } from "@/hooks/useAuth";
import useCreateCourse from "@/hooks/courses/useCreateCourse";
import useUpdateCourse from "@/hooks/courses/useUpdateCourse";
import CATEGORY_OPTIONS from "@/types/categoryType";
import { Badge } from "@/components/ui/badge";

// constants
const TAG_OPTIONS = [
  { label: "ReactJS", value: "ReactJS" },
  { label: "NextJS", value: "NextJS" },
  { label: "NodeJS", value: "NodeJS" },
  { label: "TypeScript", value: "TypeScript" },
  { label: "Python", value: "Python" },
  { label: "UI/UX", value: "UI/UX" },
];

const LEVEL_OPTIONS = ["Beginner", "Intermediate", "Advanced", "All Levels"];
const PRICE_PRESETS = [99000, 199000, 299000, 499000, 999000];

// helper: normalize tags
function normalizeTags(raw: string[]) {
  const cleaned = raw
    .map((t) => (t || "").trim())
    .filter(Boolean)
    .map((t) => t.replace(/\s+/g, " "));

  const map = new Map<string, string>();
  for (const t of cleaned) {
    const key = t.toLowerCase();
    if (!map.has(key)) map.set(key, t);
  }
  return Array.from(map.values());
}

// custom tags input component
function TagsInput({
  value,
  onChange,
  suggestions = [],
  placeholder = "react, nextjs, jwt...",
  maxTags = 20,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  suggestions?: { label: string; value: string }[];
  placeholder?: string;
  maxTags?: number;
}) {
  const [text, setText] = React.useState("");

  const addFromText = React.useCallback(() => {
    const parts = text
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!parts.length) return;

    const merged = normalizeTags([...(value || []), ...parts]).slice(
      0,
      maxTags
    );
    onChange(merged);
    setText("");
  }, [text, value, onChange, maxTags]);

  const removeTag = (tag: string) => {
    onChange((value || []).filter((t) => t !== tag));
  };

  const canAddMore = (value || []).length < maxTags;

  return (
    <div className="space-y-3 w-full">
      <Input
        value={text}
        placeholder={placeholder}
        disabled={!canAddMore}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addFromText();
          }
        }}
        onBlur={addFromText}
      />

      <div className="flex flex-wrap gap-2 w-full">
        {(value || []).map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 rounded-full border bg-white px-3 py-1 text-xs"
          >
            {t}
            <button type="button" onClick={() => removeTag(t)}>
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <span className="text-xs text-muted-foreground self-center">
          {(value || []).length}/{maxTags}
        </span>
      </div>

      {!!suggestions?.length && (
        <div className="flex flex-wrap gap-2 w-full">
          {suggestions.map((s) => {
            const exists = (value || []).some(
              (t) => t.toLowerCase() === s.value.toLowerCase()
            );
            return (
              <Button
                key={s.value}
                type="button"
                variant="secondary"
                size="sm"
                disabled={!canAddMore || exists}
                onClick={() => {
                  const merged = normalizeTags([
                    ...(value || []),
                    s.value,
                  ]).slice(0, maxTags);
                  onChange(merged);
                }}
              >
                + {s.label}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// form schema
const formSchema = z
  .object({
    title: z
      .string()
      .min(5, { message: "Title must be at least 5 characters" })
      .max(255),
    description: z.string().max(5000).optional(),
    isFree: z.boolean().default(false),
    price: z.coerce
      .number()
      .min(0, { message: "Price cannot be negative" })
      .optional(),
    category: z.array(z.string()).min(1, { message: "Category is required" }),
    tags: z.array(z.string()).default([]),
    thumbnail: z.string().min(1, { message: "Thumbnail is required" }),
    level: z.string().min(1, { message: "Level is required" }),
    isPublished: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (!data.isFree) {
      if (data.price === undefined || Number.isNaN(data.price)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["price"],
          message: "Price is required unless the course is free",
        });
      }
    }
  });

export type CourseFormValues = z.infer<typeof formSchema>;

interface CourseFormProps {
  initialData?: any;
}

export default function CourseForm({ initialData }: CourseFormProps) {
  const router = useRouter();
  const { data: user } = useCurrentUser();

  const { createCourse, isPending: isCreating } = useCreateCourse();
  const { updateCourse, isPending: isUpdating } = useUpdateCourse();

  const isLoading = isCreating || isUpdating;
  const isEditMode = !!initialData;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      isFree: (initialData?.price ?? 0) === 0,
      price: initialData?.price ?? 0,
      category: initialData?.category ? [initialData.category] : [],
      tags: initialData?.tags || [],
      thumbnail: initialData?.thumbnail || "",
      level: initialData?.level || "",
      isPublished: initialData?.isPublished || false,
    },
    mode: "onChange",
  });

  const watchedIsPublished = form.watch("isPublished");
  const watchedIsFree = form.watch("isFree");

  const onSubmit = async (values: CourseFormValues) => {
    try {
      const payload = {
        ...values,
        price: values.isFree ? 0 : Number(values.price ?? 0),
        category: values.category[0],
      };

      if (isEditMode) {
        await updateCourse({
          courseId: initialData._id,
          dataToUpdate: payload,
        });
      } else {
        await createCourse(payload);
      }
    } catch (error) {
      console.error("Submit error", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      <div className="max-w-7xl mx-auto p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* left column */}
            <div className="lg:col-span-4 space-y-6">
              {/* instructor card */}
              <Card className="border-slate-200 shadow-sm !p-0">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="h-10 w-10 border shadow-sm">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback>I</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {user?.fullName}
                      </p>
                      <p className="text-xs text-slate-500">Instructor (You)</p>
                    </div>
                  </div>
                  <Badge
                    className={
                      watchedIsPublished
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-yellow-500 hover:bg-yellow-600"
                    }
                  >
                    {watchedIsPublished ? "Published" : "Draft"}
                  </Badge>
                </CardContent>
              </Card>

              {/* thumbnail upload */}
              <UploadV2
                control={form.control}
                name="thumbnail"
                description="Recommend: 1280x720 (16:9). Max 5MB."
                accept="image/png, image/jpeg, image/webp"
                maxSize={5}
              />
            </div>

            {/* right column */}
            <div className="lg:col-span-8 space-y-6">
              <Card className="border-slate-200 shadow-sm">
                <CardContent className="p-8 space-y-6">
                  {/* title input */}
                  <InputField
                    control={form.control}
                    name="title"
                    label="Course Title"
                    placeholder="e.g. Master ReactJS in 30 Days"
                    description="Short, clear, searchable."
                  />

                  {/* description input */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="What students will learn..."
                            className="min-h-[150px] resize-none focus-visible:ring-indigo-600"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* category and level */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div className="w-full">
                      <MultiSelectV2
                        control={form.control}
                        name="category"
                        label="Category"
                        options={CATEGORY_OPTIONS}
                        placeholder="Select category"
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="level"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Level</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {LEVEL_OPTIONS.map((level) => (
                                <SelectItem key={level} value={level}>
                                  {level}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* pricing section */}
                  <div className="rounded-lg border p-4 bg-slate-50/50 space-y-4">
                    <FormField
                      control={form.control}
                      name="isFree"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base font-semibold">
                              Free course
                            </FormLabel>
                            <FormDescription>
                              Enable to set price = 0 and lock price input.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                if (checked) {
                                  form.setValue("price", 0, {
                                    shouldValidate: true,
                                  });
                                }
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Price (VND)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0 for Free"
                                disabled={watchedIsFree}
                                //@ts-ignore
                                value={field.value ?? 0}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="w-full">
                        <FormLabel>Suggested prices</FormLabel>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {PRICE_PRESETS.map((p) => (
                            <Button
                              key={p}
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={watchedIsFree}
                              onClick={() =>
                                form.setValue("price", p, {
                                  shouldValidate: true,
                                })
                              }
                            >
                              {p.toLocaleString("vi-VN")}đ
                            </Button>
                          ))}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={watchedIsFree}
                            onClick={() =>
                              form.setValue("price", 0, {
                                shouldValidate: true,
                              })
                            }
                          >
                            Reset
                          </Button>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                          Choose a preset to avoid manual typing.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* tags input */}
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Keywords</FormLabel>
                        <FormControl>
                          <TagsInput
                            value={field.value || []}
                            onChange={field.onChange}
                            suggestions={TAG_OPTIONS}
                            placeholder="react, nextjs, jwt..."
                            maxTags={20}
                          />
                        </FormControl>
                        <FormDescription>
                          Use comma or Enter to add.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* publish switch */}
                  <FormField
                    control={form.control}
                    name="isPublished"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-slate-50/50">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base font-semibold">
                            Publish Course
                          </FormLabel>
                          <FormDescription>
                            Students can see and enroll when published.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* footer actions */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-slate-200 p-4 z-50">
              <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  Discard Changes
                </Button>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 hidden sm:inline-block">
                    {isEditMode ? "Editing" : "Creating"}
                  </span>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="min-w-[140px] bg-[#020080] hover:bg-blue-900 text-white font-bold rounded-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isEditMode ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {isEditMode ? "Save Changes" : "Create Course"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
