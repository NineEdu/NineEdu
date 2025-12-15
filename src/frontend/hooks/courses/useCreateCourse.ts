import { useMutation, useQueryClient } from "@tanstack/react-query";
import courseApis from "@/shared/apis/courseApis";
import { notifySuccess, notifyError } from "@/components/Notify";
import { useRouter } from "next/navigation";

const useCreateCourse = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (payload: any) => courseApis.createCourse(payload),

    onSuccess: (res: any) => {
      notifySuccess("Khóa học đã được tạo thành công!");
      queryClient.invalidateQueries({ queryKey: ["getCourses"] });

      const createdCourse = res?.data?.data ?? res?.data ?? res;

      const courseId = createdCourse?._id || createdCourse?.id;

      if (courseId) {
        router.push(`/courses/${courseId}/edit`);
        return;
      }

      router.push("/admin/courses");
    },

    onError: (error: any) => {
      notifyError(error?.response?.data?.message || "Tạo khóa học thất bại");
    },
  });

  return {
    createCourse: mutation.mutateAsync,
    ...mutation,
  };
};

export default useCreateCourse;
