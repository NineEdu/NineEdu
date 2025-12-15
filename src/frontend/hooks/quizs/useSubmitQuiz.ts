import { notifyError, notifySuccess } from "@/components/Notify";
import quizApis from "@/shared/apis/quizApis";
import { useMutation } from "@tanstack/react-query";

const mutationFn = async ({
  answers,
  quizId,
}: {
  answers: any;
  quizId: string;
}) => {
  return await quizApis.submitQuiz({ answers, quizId });
};

//@ts-ignore
const useSubmitQuizz = (mutationOptions) => {
  const mutation = useMutation({ mutationFn, ...mutationOptions });
  const submitQuizz = async ({
    answers,
    quizId,
  }: {
    answers: any;
    quizId: string;
  }) => {
    try {
      //@ts-ignore
      const res = await mutation.mutateAsync({
        answers,
        quizId,
      });
      notifySuccess("Submit quiz successfully");
      return res;
    } catch (error) {
      notifyError(error);
      return error;
    }
  };

  return { submitQuizz, ...mutation };
};

export default useSubmitQuizz;
