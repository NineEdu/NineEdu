"use client";

import { notifyError, notifySuccess } from "@/components/Notify";
import lessonApis from "@/shared/apis/lessonApis";
import { mutationOptions, useMutation } from "@tanstack/react-query";

const mutationFn = async ({
  lessonId,
  dataToUpdate,
}: {
  lessonId: string;
  dataToUpdate: {
    title?: string;
    content?: string;
    videoUrl?: string;
  };
}) => {
  return await lessonApis.updateLesson({ lessonId, dataToUpdate });
};

//@ts-ignore
const useUpdateLesson = (mutationOptions) => {
  const mutation = useMutation({ mutationFn, ...mutationOptions });

  const updateLesson = async ({
    lessonId,
    dataToUpdate,
  }: {
    lessonId: string;
    dataToUpdate: {
      title?: string;
      content?: string;
      videoUrl?: string;
    };
  }) => {
    try {
      //@ts-ignore
      const res = await mutation.mutateAsync({
        lessonId,
        dataToUpdate,
      });
      notifySuccess("Lesson updated successfully");
      return res;
    } catch (error) {
      notifyError(error);
      return error;
    }
  };

  return { updateLesson, ...mutation };
};

export default useUpdateLesson;
