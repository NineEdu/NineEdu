import { notifyError, notifySuccess } from "@/components/Notify";
import announcementApis from "@/shared/apis/announcementApis";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKey as getAnnouncementsKey } from "./useGetAnnouncements";

const mutationFn = async (data: any) => {
  return await announcementApis.createAnnouncement(data);
};

//@ts-ignore
const useCreateAnnouncement = (mutationOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn,
    ...mutationOptions,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: getAnnouncementsKey });
      if (mutationOptions?.onSuccess) {
        mutationOptions.onSuccess(data, variables, context);
      }
    },
  });

  const createAnnouncement = async (data: any) => {
    try {
      //@ts-ignore
      const res = await mutation.mutateAsync(data);
      notifySuccess("Announcement sent successfully!");
      return res;
    } catch (error) {
      notifyError(error);
      return error;
    }
  };

  return { createAnnouncement, ...mutation };
};

export default useCreateAnnouncement;
