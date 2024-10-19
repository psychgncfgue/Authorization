export const FETCH_CAROUSEL_REQUEST = 'FETCH_CAROUSEL_REQUEST';



export const fetchCarouselRequest = (page: number = 1) => ({
    type: FETCH_CAROUSEL_REQUEST,
    payload: { page },
});