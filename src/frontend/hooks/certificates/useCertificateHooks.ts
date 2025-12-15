// @ts-nocheck
import certificateApis from "@/shared/apis/certificateApis";
import { createUseQuery } from "@/utils/reactQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifySuccess, notifyError } from "@/components/Notify";

export const keys = {
  myCertificates: ["getMyCertificates"],
  detail: (code) => ["getCertificateByCode", code],
};

export const useGetCertificateByCode = createUseQuery({
  queryKey: keys.detail(""),
  queryFn: (params) => certificateApis.getCertificateByCode(params),
});

export const useGetMyCertificates = createUseQuery({
  queryKey: keys.myCertificates,
  queryFn: () => certificateApis.getMyCertificates(),
});

export const useIssueCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: certificateApis.issueCertificate,
    onSuccess: (data) => {
      notifySuccess("Chúc mừng! Bạn đã nhận được chứng chỉ.");
      queryClient.invalidateQueries({ queryKey: keys.myCertificates });
      return data;
    },
    onError: (error) => {
      notifyError(error);
    },
  });
};
