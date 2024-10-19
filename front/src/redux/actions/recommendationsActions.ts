export const FETCH_RECOMMENDATIONS_REQUEST = 'FETCH_RECOMMENDATIONS_REQUEST';




export const fetchRecommendationsRequest = (page: number = 1) => ({
    type: FETCH_RECOMMENDATIONS_REQUEST,
    payload: { page },
});