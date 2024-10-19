import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../interfaces/interfaces';

interface CarouselState {
    products: Product[];
    isLoadingCarousel: boolean;
    error: string | null;
}

const initialState: CarouselState = {
    products: [],
    isLoadingCarousel: false,
    error: null,
};

const carouselSlice = createSlice({
    name: 'carousel',
    initialState,
    reducers: {
        fetchCarouselProductsRequest(state) {
            state.isLoadingCarousel = true;
            state.error = null;
        },
        fetchCarouselProductsSuccess(state, action: PayloadAction<Product[]>) {
            state.products = action.payload;
            state.isLoadingCarousel = false;
        },
        fetchCarouselProductsFailure(state, action: PayloadAction<string>) {
            state.isLoadingCarousel = false;
            state.error = action.payload;
        },
    },
});

export const {
    fetchCarouselProductsRequest,
    fetchCarouselProductsSuccess,
    fetchCarouselProductsFailure,
} = carouselSlice.actions;

export default carouselSlice.reducer;