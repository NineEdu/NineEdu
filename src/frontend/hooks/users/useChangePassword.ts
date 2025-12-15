// @ts-nocheck
import { notifySuccess, notifyError } from "@/components/Notify";
import userApis from "@/shared/apis/userApis";
import { useMutation } from "@tanstack/react-query";

const useChangePassword = () => {
  const mutation = useMutation({
    mutationFn: (data: any) => userApis.changePassword(data),
    onSuccess: () => {
      notifySuccess("Đổi mật khẩu thành công");
    },
    onError: (error: any) => {
      notifyError(error?.response?.data?.message || "Đổi mật khẩu thất bại");
    },
  });

  return { changePassword: mutation.mutate, isChanging: mutation.isPending };
};

export default useChangePassword;
