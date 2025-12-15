import { notifyError, notifySuccess } from "@/components/Notify";
import enrollmentApis from "@/shared/apis/enrollmentApis";
import { useMutation } from "@tanstack/react-query";

const mutationFn = async ({ courseId }: { courseId: string }) => {
  return await enrollmentApis.checkEnrollmentStatus({ courseId });
};

//@ts-ignore
const useCheckEnrollCourse = (mutationOptions) => {
  const mutation = useMutation({ mutationFn, ...mutationOptions });
  const checkEnrollCourse = async ({ courseId }: { courseId: string }) => {
    try {
      //@ts-ignore
      const res = await mutation.mutateAsync({ courseId });
      notifySuccess("Enrolled in course successfully");
      return res;
    } catch (error) {
      notifyError(error);
      return error;
    }
  };

  return { checkEnrollCourse, ...mutation };
};

export default useCheckEnrollCourse;
