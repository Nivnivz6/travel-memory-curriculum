import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useUpload = () => {
    const [progress, setProgress] = useState(0);
    const queryClient = useQueryClient();

    const uploadMutation = useMutation({
        mutationFn: async ({ file, name }) => {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('name', name);

            // Use axios with onUploadProgress for progress tracking
            return axios.post('/api/images/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (event) => {
                    const percent = Math.round((event.loaded * 100) / event.total);
                    setProgress(percent);
                },
            });
        },
        onSuccess: () => {
            setProgress(0);
            // Invalidate images query to refetch
            queryClient.invalidateQueries({ queryKey: ['images'] });
        },
    });

    return {
        upload: uploadMutation.mutate,
        isUploading: uploadMutation.isPending,
        progress,
        error: uploadMutation.error,
        ...uploadMutation
    };
};