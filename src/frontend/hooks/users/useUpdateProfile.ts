// @ts-nocheck
import { notifySuccess, notifyError } from "@/components/Notify";
import userApis from "@/shared/apis/userApis";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: any) => userApis.updateProfile(data),
    onSuccess: (data) => {
      notifySuccess("Cập nhật hồ sơ thành công");
      queryClient.setQueryData(["currentUser"], data);
    },
    onError: (error: any) => {
      notifyError(error?.response?.data?.message || "Cập nhật thất bại");
    },
  });

  return { updateProfile: mutation.mutate, isUpdating: mutation.isPending };
};

export default useUpdateProfile;
