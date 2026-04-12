import { useQuery } from "@tanstack/react-query";
import { fetchImagesApi } from "../api/client";

export const useImages = (filters = {}) => {
    const query = useQuery({
        queryKey: ["images", filters],
        queryFn: () => fetchImagesApi(filters),
    });

    return {
        images: query.data?.data || [],
        isLoading: query.isLoading,
        error: query.error,
        refetch: query.refetch,
    };
};