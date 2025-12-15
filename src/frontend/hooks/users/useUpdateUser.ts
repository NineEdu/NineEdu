// @ts-nocheck
import { notifyError, notifySuccess } from "@/components/Notify";
import userApis from "@/shared/apis/userApis";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKey as getUsersKey } from "./useGetUsers";

const mutationFn = async ({ userId, data }: { userId: string; data: any }) => {
  return await userApis.updateUser({ userId, data });
};

const useUpdateUser = (mutationOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn,
    ...mutationOptions,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: getUsersKey });
      if (mutationOptions?.onSuccess) {
        mutationOptions.onSuccess(data, variables, context);
      }
    },
  });

  const updateUser = async ({
    userId,
    data,
  }: {
    userId: string;
    data: any;
  }) => {
    try {
      const res = await mutation.mutateAsync({ userId, data });
      notifySuccess("Cập nhật thông tin người dùng thành công");
      return res;
    } catch (error) {
      notifyError(error);
      return error;
    }
  };

  return { updateUser, ...mutation };
};

export default useUpdateUser;
