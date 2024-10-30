import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {CartItem} from '../../interfaces/interfaces';

interface CartState {
    cartItems: CartItem[];
    isLoadingAddToCart: boolean;
    error: string | null;
    isLoadingCart: boolean;
}

const initialState: CartState = {
    cartItems: [],
    isLoadingAddToCart: false,
    error: null,
    isLoadingCart: false,
};


const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCartRequest(state) {
            state.isLoadingAddToCart = true;
            state.error = null;
        },
        addToCartSuccess(state, action: PayloadAction<{ id: string; updatedAt: string; items: CartItem[] }>) {
            state.isLoadingAddToCart = false;
            state.error = null;
            if (Array.isArray(action.payload.items)) {
                state.cartItems = action.payload.items.map(item => ({
                    ...item,
                    quantity: 1,
                    totalQuantity: 0,
                }));
            } else {
                console.error('Payload не содержит массив items:', action.payload);
                state.error = 'Ошибка: payload.items не является массивом';
            }
        },
        addToCartFailure(state, action: PayloadAction<string>) {
            const error  = action.payload;
            state.isLoadingAddToCart = false;
            state.error = error;
        },
        removeFromCartRequest(state) {
            state.isLoadingCart = true;
            state.error = null;
        },
        removeFromCartSuccess(state, action: PayloadAction<CartItem[]>) {
            state.cartItems = action.payload;
            state.isLoadingCart = false;
            const updatedQuantities = JSON.parse(localStorage.getItem('cartQuantities') || '{}');
            action.payload.forEach(item => {
                delete updatedQuantities[item.id];
            });
            localStorage.setItem('cartQuantities', JSON.stringify(updatedQuantities));
        },
        removeFromCartFailure(state, action: PayloadAction<string>) {
            state.isLoadingCart = false;
            state.error = action.payload;
        },
        fetchCartRequest(state) {
            state.isLoadingCart = true;
            state.error = null;
        },
        fetchCartSuccess(state, action: PayloadAction<CartItem[]>) {
            state.isLoadingCart = false;
            state.error = null;
            state.cartItems = action.payload.map(item => {
                const existingItem = state.cartItems.find(existing => existing.id === item.id);
                const quantityFromLocalStorage = JSON.parse(localStorage.getItem('cartQuantities') || '{}')[item.id] || 1;
                return {
                    ...item,
                    quantity: existingItem ? existingItem.quantity : quantityFromLocalStorage,
                    totalQuantity: existingItem ? existingItem.totalQuantity : 0,
                };
            });
        },
        fetchCartFailure(state, action: PayloadAction<string>) {
            state.isLoadingCart = false;
            state.error = action.payload;
        },
        clearCartRequest(state) {
            state.isLoadingCart = true;
        },
        clearCartSuccess(state) {
            state.isLoadingCart = false;
            state.error = null;
            state.cartItems = [];
            localStorage.removeItem('cartQuantities');
        },
        clearCartFailure(state, action: PayloadAction<string>) {
            state.isLoadingCart = false;
            state.error = action.payload;
        },
        checkQuantityRequest(state) {
            state.isLoadingAddToCart = true;
            state.error = null;
        },
        checkQuantitySuccess(state, action: PayloadAction<{ id: string; count: number }>) {
            state.isLoadingAddToCart = false;
            state.error = null;
            const { id, count } = action.payload;
            state.cartItems = state.cartItems.map((item) =>
                item.id === id ? { ...item, totalQuantity: count } : item
            );
        },
        checkQuantityFailure(state, action: PayloadAction<string>) {
            state.isLoadingAddToCart = false;
            state.error = action.payload;
        },
        updateQuantity(state, action: PayloadAction<{ id: string; change: number }>) {
            const { id, change } = action.payload;
            const item = state.cartItems.find(item => item.id === id);
            if (item) {
                item.quantity += change
                const currentQuantities = JSON.parse(localStorage.getItem('cartQuantities') || '{}');
                currentQuantities[id] = item.quantity;
                localStorage.setItem('cartQuantities', JSON.stringify(currentQuantities));
            }
        },
    },
});

export const {
    addToCartRequest,
    addToCartSuccess,
    addToCartFailure,
    removeFromCartRequest,
    removeFromCartSuccess,
    removeFromCartFailure,
    fetchCartRequest,
    fetchCartSuccess,
    fetchCartFailure,
    clearCartRequest,
    clearCartSuccess,
    clearCartFailure,
    checkQuantityRequest,
    checkQuantitySuccess,
    checkQuantityFailure,
    updateQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;