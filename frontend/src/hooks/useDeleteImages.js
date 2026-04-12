import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteImagesApi } from "../api/client";

export const useDeleteImages = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (ids) => deleteImagesApi(ids),
        onMutate: async (ids) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['images'] });

            // Snapshot previous value
            const previousImages = queryClient.getQueryData(['images']);

            // Optimistically update
            queryClient.setQueryData(['images'], (old) =>
                old?.filter(img => !ids.includes(img._id))
            );

            return { previousImages };
        },
        onError: (err, ids, context) => {
            // Rollback on error
            queryClient.setQueryData(['images'], context.previousImages);
        },
        onSettled: () => {
            // Refetch to ensure data is in sync
            queryClient.invalidateQueries({ queryKey: ['images'] });
        },
    });
    return {
        deleteImages: mutation.mutate,
        isDeleting: mutation.isPending,
        error: mutation.error,
    };
};