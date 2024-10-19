export const ADD_TO_FAVORITES = 'ADD_TO_FAVORITES';
export const FETCH_FAVORITES = 'FETCH_FAVORITES';
export const REMOVE_FROM_FAVORITES = 'REMOVE_FROM_FAVORITES';
export const CLEAR_FAVORITES = 'CLEAR_FAVORITES'

export const addToFavorites = ({ userId, productNames }: { userId: string; productNames: string[] }) => ({
    type: ADD_TO_FAVORITES,
    payload: { userId, productNames },
});

export const fetchFavorites = (userId: string) => ({
    type: FETCH_FAVORITES,
    payload: userId,
});

export const removeFromFavorites = (userId: string, productName: string) => ({
    type: REMOVE_FROM_FAVORITES,
    payload: { userId, productName },
});

export const clearFavorites = (userId: string) => ({
    type: CLEAR_FAVORITES,
    payload: userId,
})
