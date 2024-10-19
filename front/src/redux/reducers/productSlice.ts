import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {Product} from "../../interfaces/interfaces";

interface ProductState {
    products: Product[];
    isLoadingProduct: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
}

const initialState: ProductState = {
    products: [],
    isLoadingProduct: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
};

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        fetchProductsRequest(state) {
            state.isLoadingProduct = true;
            state.error = null;
        },
        fetchProductsSuccess(state, action: PayloadAction<{ products: Product[]; totalPages: number; currentPage: number }>) {
            state.products = action.payload.products;
            state.totalPages = action.payload.totalPages;
            state.currentPage = action.payload.currentPage;
            state.isLoadingProduct = false;
        },
        fetchProductsFailure(state, action: PayloadAction<string>) {
            state.isLoadingProduct = false;
            state.error = action.payload;
        },
    },
});

export const {
    fetchProductsRequest,
    fetchProductsSuccess,
    fetchProductsFailure,
} = productSlice.actions;

export default productSlice.reducer;