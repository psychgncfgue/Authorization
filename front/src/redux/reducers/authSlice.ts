import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    userId: string | null;
    isAuthenticated: boolean;
    user: {
        email: string;
        username: string;
    } | null;
    error: string | null;
    isLoading: boolean;
    cartOpen: boolean;
}

const initialState: AuthState = {
    userId: null,
    isAuthenticated: false,
    user: null,
    error: null,
    isLoading: true,
    cartOpen: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginRequest(state) {
            state.isLoading = true;
        },
        loginSuccess(state, action: PayloadAction<{ userId: string; email: string; username: string }>) {
            state.userId = action.payload.userId;
            state.user = {
                email: action.payload.email,
                username: action.payload.username,
            };
            state.isAuthenticated = true;
            state.error = null;
            state.isLoading = false;
        },
        loginFailure(state, action: PayloadAction<string>) {
            state.isLoading = false;
            state.error = action.payload;
        },
        logoutRequest(state) {
            state.isLoading = true;
        },
        logoutSuccess(state) {
            state.isAuthenticated = false;
            state.error = null;
            state.isLoading = false;
            state.userId = null;
        },
        logoutFailure(state, action: PayloadAction<string>) {
            state.error = action.payload;
            state.isLoading = false;
        },
        checkAuthRequest(state) {
            state.isLoading = true;
        },
        checkAuthSuccess(state) {
            state.isAuthenticated = true;
            state.isLoading = false;
        },
        checkAuthFailure(state) {
            state.userId = '';
            state.isAuthenticated = false;
            state.isLoading = false;
        },
        openCart(state) {
            state.cartOpen = true;
        },
        closeCart(state) {
            state.cartOpen = false;
        },
    },
});

export const { loginRequest, loginSuccess, loginFailure, logoutSuccess, logoutFailure, logoutRequest, checkAuthRequest, checkAuthSuccess, checkAuthFailure, openCart, closeCart } = authSlice.actions;
export default authSlice.reducer;