import { useMutation } from "@tanstack/react-query";
import enrollmentApis from "@/shared/apis/enrollmentApis";

const usePaymentCourse = (mutationOptions?: any) => {
  const mutation = useMutation({
    mutationFn: ({
      courseId,
      amount,
    }: {
      courseId: string;
      amount: number;
    }) => {
      return enrollmentApis.createPaymentUrl({ courseId, amount });
    },
    ...mutationOptions,
  });

  const paymentCourse = async ({
    courseId,
    amount,
  }: {
    courseId: string;
    amount: number;
  }) => {
    try {
      const res = await mutation.mutateAsync({ courseId, amount });
      return res;
    } catch (error) {
      throw error;
    }
  };

  return { paymentCourse, ...mutation };
};

export default usePaymentCourse;
