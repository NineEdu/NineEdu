import { useMutation, useQueryClient } from "@tanstack/react-query";
import courseApis from "@/shared/apis/courseApis";
import { notifySuccess, notifyError } from "@/components/Notify";

const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      courseId,
      dataToUpdate,
    }: {
      courseId: string;
      dataToUpdate: any;
    }) => courseApis.updateCourse({ courseId, dataToUpdate }),
    onSuccess: (data) => {
      notifySuccess("Cập nhật khóa học thành công!");
      queryClient.invalidateQueries({ queryKey: ["course", data._id] });
      queryClient.invalidateQueries({ queryKey: ["getCourses"] });
    },
    onError: (error: any) => {
      notifyError(error?.response?.data?.message || "Cập nhật thất bại");
    },
  });

  return { updateCourse: mutation.mutate, ...mutation };
};

export default useUpdateCourse;
