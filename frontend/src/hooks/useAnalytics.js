export const useAnalytics = (options = {}) => {
    const statsQuery = useQuery({
        queryKey: ['analytics', 'images', options.status],
        queryFn: () => getImageCountApi(options.status),
    });

    const leaderboardQuery = useQuery({
        queryKey: ['analytics', 'uploads', options.metric, options.limit],
        queryFn: () => getLeaderboardApi(options.metric, options.limit),
    });

    return {
        stats: statsQuery.data,
        leaderboard: leaderboardQuery.data,
        isLoading: statsQuery.isLoading || leaderboardQuery.isLoading,
    };
};

