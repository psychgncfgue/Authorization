import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FavoritesItem } from "../../interfaces/interfaces";

interface favoritesState {
    favoritesProducts: FavoritesItem[];
    loadingStates: { [key: string]: boolean };
    error: string | null;
    isLoadingFavorites: boolean;
    addedItems: string[];
}

const initialState: favoritesState = {
    addedItems: [],
    favoritesProducts: [],
    loadingStates: {},
    error: null,
    isLoadingFavorites: false,
};

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        addToFavoritesRequest(state, action: PayloadAction<string>) {
            state.loadingStates[action.payload] = true;
            state.error = null;
        },
        addToFavoritesSuccess(state, action: PayloadAction<string>) {
            state.loadingStates[action.payload] = false;
            state.error = null;
            state.addedItems.push(action.payload);
        },
        addToFavoritesFailure(state, action: PayloadAction<{ productId: string; error: string }>) {
            const { productId, error } = action.payload;
            state.loadingStates[productId] = false;
            state.error = error;
        },
        removeFromFavoritesRequest(state, action: PayloadAction<string>) {
            state.isLoadingFavorites = true;
            state.error = null;
        },
        removeFromFavoritesSuccess(state, action: PayloadAction<string>) {
            const productId = action.payload;
            state.addedItems = state.addedItems.filter(id => id !== productId);
            state.isLoadingFavorites = false;
        },
        removeFromFavoritesFailure(state, action: PayloadAction<string>) {
            state.isLoadingFavorites = false;
            state.error = action.payload;
        },
        getFavoritesRequest(state) {
            state.isLoadingFavorites = true;
            state.error = null;
        },
        getFavoritesSuccess(state, action: PayloadAction<{ id: string; updatedAt: string; items: FavoritesItem[] }>) {
            state.isLoadingFavorites = false;
            state.error = null;
            state.favoritesProducts = action.payload.items;
            state.addedItems = action.payload.items.map(item => item.product.name);
        },
        getFavoritesFailure(state, action: PayloadAction<string>) {
            state.isLoadingFavorites = false;
            state.error = action.payload;
        },
        clearFavoritesRequest(state) {
            state.isLoadingFavorites = true;
        },
        clearFavoritesSuccess(state) {
            state.isLoadingFavorites = false;
            state.error = null;
            state.addedItems = [];
            state.favoritesProducts = [];
            state.loadingStates = {};
        },
        clearFavoritesFailure(state, action: PayloadAction<string>) {
            state.isLoadingFavorites = false;
            state.error = action.payload;
        }
    },
});

export const {
    addToFavoritesRequest,
    addToFavoritesSuccess,
    addToFavoritesFailure,
    removeFromFavoritesRequest,
    removeFromFavoritesSuccess,
    removeFromFavoritesFailure,
    getFavoritesRequest,
    getFavoritesSuccess,
    getFavoritesFailure,
    clearFavoritesRequest,
    clearFavoritesSuccess,
    clearFavoritesFailure
} = favoritesSlice.actions;

export default favoritesSlice.reducer;