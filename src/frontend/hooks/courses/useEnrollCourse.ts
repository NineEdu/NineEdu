//@ts-nocheck

import { useMutation, useQueryClient } from "@tanstack/react-query";
import enrollmentApis from "@/shared/apis/enrollmentApis";
import { notifyError, notifySuccess, notifyInfo } from "@/components/Notify";
import { useRouter } from "next/navigation";

const mutationFn = async ({ courseId }: { courseId: string }) => {
  return await enrollmentApis.joinCourse({ courseId });
};

const useEnrollCourse = (mutationOptions?: any) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn,
    ...mutationOptions,
  });

  const enrollCourse = async ({ courseId }: { courseId: string }) => {
    try {
      const response = await mutation.mutateAsync({ courseId });

      if (response.type === "FREE") {
        notifySuccess(response.message || "Đăng ký thành công!");

        queryClient.invalidateQueries({ queryKey: ["course", courseId] });
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      } else if (response.type === "PAID") {
        notifyInfo("Đang chuyển đến trang thanh toán...");

        router.push(`/courses/${courseId}/payment`);
      }

      return response;
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Có lỗi xảy ra";
      notifyError(msg);
      throw error;
    }
  };

  return { enrollCourse, ...mutation };
};

export default useEnrollCourse;
