import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../interfaces/interfaces';

interface RecommendationsState {
    recommendations: Product[];
    isLoadingRecommendations: boolean;
    error: string | null;
}

const initialState: RecommendationsState = {
    recommendations: [],
    isLoadingRecommendations: false,
    error: null,
};

const recommendationsSlice = createSlice({
    name: 'recommendations',
    initialState,
    reducers: {
        fetchRecommendationsRequest: (state) => {
            state.isLoadingRecommendations = true;
            state.error = null;
        },
        fetchRecommendationsSuccess: (state, action: PayloadAction<Product[]>) => {
            state.isLoadingRecommendations = false;
            state.recommendations = action.payload;
        },
        fetchRecommendationsFailure: (state, action: PayloadAction<string>) => {
            state.isLoadingRecommendations = false;
            state.error = action.payload;
        },
    },
});

export const {
    fetchRecommendationsRequest,
    fetchRecommendationsSuccess,
    fetchRecommendationsFailure,
} = recommendationsSlice.actions;

export default recommendationsSlice.reducer;