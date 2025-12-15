// @ts-nocheck
import { notifyError, notifySuccess } from "@/components/Notify";
import userApis from "@/shared/apis/userApis";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKey as getUsersKey } from "./useGetUsers";

const mutationFn = async ({ userId }: { userId: string }) => {
  return await userApis.deleteUser({ userId });
};

const useDeleteUser = (mutationOptions) => {
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

  const deleteUser = async ({ userId }: { userId: string }) => {
    try {
      const res = await mutation.mutateAsync({ userId });
      notifySuccess("Đã xóa người dùng thành công");
      return res;
    } catch (error) {
      notifyError(error);
      return error;
    }
  };

  return { deleteUser, ...mutation };
};

export default useDeleteUser;
