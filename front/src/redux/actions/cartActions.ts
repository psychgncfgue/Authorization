import {CartItem, ProductData} from "../../interfaces/interfaces";

export const ADD_TO_CART = 'ADD_TO_CART';
export const FETCH_CART = 'FETCH_FAVORITES';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const CLEAR_CART = 'CLEAR_CART'
export const CHECK_QUANTITY = 'CHECK_QUANTITY';


export const checkQuantity = (userId: string, productData: ProductData[], cartItems: CartItem[]) => ({
    type: CHECK_QUANTITY,
    payload: { userId, productData, cartItems }, 
});

export const addToCart = (userId: string, productId: number) => ({
    type: ADD_TO_CART,
    payload: { userId, productId },
});

export const fetchCart = (userId: string) => ({
    type: FETCH_CART,
    payload: userId,
});

export const removeFromCart = (userId: string, productId: number) => ({
    type: REMOVE_FROM_CART,
    payload: { userId, productId },
});

export const clearCart = (userId: string) => ({
    type: CLEAR_CART,
    payload: userId,
})