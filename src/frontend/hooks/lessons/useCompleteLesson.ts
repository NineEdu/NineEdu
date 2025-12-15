import { notifyError, notifySuccess } from "@/components/Notify";
import useModal from "@/modals/useModal";
import enrollmentApis from "@/shared/apis/enrollmentApis";
import { LessonCompleteModal } from "@/shared/modals/LessonCompleteModal";
import { useMutation } from "@tanstack/react-query";

const mutationFn = async ({
  courseId,
  lessonId,
}: {
  courseId: string;
  lessonId: string;
}) => {
  return await enrollmentApis.completeLesson({ courseId, lessonId });
};

const useCompleteLesson = (mutationOptions?: any) => {
  const mutation = useMutation({ mutationFn, ...mutationOptions });
  const { show } = useModal(LessonCompleteModal);
  const completeLesson = async ({
    courseId,
    lessonId,
  }: {
    courseId: string;
    lessonId: string;
  }) => {
    try {
      //@ts-ignore
      const res = await mutation.mutateAsync({ courseId, lessonId });
      notifySuccess("Lesson completed successfully");
      return res;
    } catch (error) {
      notifyError(error);

      return error;
    }
  };

  return { completeLesson, ...mutation };
};

export default useCompleteLesson;
