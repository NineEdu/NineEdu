import { notifyError, notifySuccess } from "@/components/Notify";
import lessonApis from "@/shared/apis/lessonApis";
import { mutationOptions, useMutation } from "@tanstack/react-query";

const mutationFn = async ({ lessonId }: { lessonId: string }) => {
  return await lessonApis.deleteLesson({ lessonId });
};

//@ts-ignore
const useDeleteLesson = (mutationOptions) => {
  const mutation = useMutation({ mutationFn, ...mutationOptions });
  const deleteLesson = async ({ lessonId }: { lessonId: string }) => {
    try {
      //@ts-ignore
      const res = await mutation.mutateAsync({ lessonId });
      notifySuccess("Lesson deleted successfully");
      return res;
    } catch (error) {
      notifyError(error);
    }
  };

  return { deleteLesson, ...mutation };
};

export default useDeleteLesson;
