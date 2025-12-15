// @ts-nocheck
import { notifyError, notifySuccess } from "@/components/Notify";
import courseApis from "@/shared/apis/courseApis";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKey as getCoursesKey } from "./useGetCourses";

const mutationFn = async ({ courseId }: { courseId: string }) => {
  return await courseApis.deleteCourse({ courseId });
};

const useDeleteCourse = (mutationOptions) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({ mutationFn, ...mutationOptions });

  const deleteCourse = async ({ courseId }: { courseId: string }) => {
    try {
      const res = await mutation.mutateAsync({ courseId });
      notifySuccess("Xóa khóa học thành công!");

      queryClient.invalidateQueries({ queryKey: getCoursesKey });

      return res;
    } catch (error) {
      const message = error?.response?.data?.message || "Xóa thất bại";
      notifyError(message);
      return error;
    }
  };

  return { deleteCourse, ...mutation };
};

export default useDeleteCourse;
