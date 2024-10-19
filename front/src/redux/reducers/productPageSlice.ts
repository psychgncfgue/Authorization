import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ProductPage {
    id: number | null;
    name: string | null;
    description: string | null;
    price: number | null;
    imageUrl: string | null;
    discount: number | null;
    size: string | null;
    availability: boolean | null;
}

interface ProductState {
    productPage: ProductPage;
    isLoadingProductPage: boolean;
    error: string | null;
}

const initialState: ProductState = {
    productPage: {
        id:  null,
        name:  null,
        description:  null,
        price:  null,
        imageUrl:  null,
        discount: null,
        size: null,
        availability: null,
    },
    isLoadingProductPage: false,
    error: null,
};

const productPageSlice = createSlice({
    name: 'productPage',
    initialState,
    reducers: {
        fetchProductPageRequest(state) {
            state.isLoadingProductPage = true;
            state.error = null;
            state.productPage.availability = null;
        },
        fetchProductPageSuccess(state, action: PayloadAction<ProductPage>) {
            state.productPage = action.payload;
            state.isLoadingProductPage = false;
            state.productPage.availability = true;
        },
        fetchProductPageFailure(state, action: PayloadAction<string>) {
            state.isLoadingProductPage = false;
            state.error = action.payload;
            if (action.payload === 'Product not found') {
                state.productPage.availability = false;
            }
        },
    },
});

export const {
    fetchProductPageRequest,
    fetchProductPageSuccess,
    fetchProductPageFailure,
} = productPageSlice.actions;

export default productPageSlice.reducer;