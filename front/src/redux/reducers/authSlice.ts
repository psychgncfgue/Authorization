import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    isAuthenticated: boolean;
    user: {
        email: string;
        username: string;
    } | null;
    error: string | null;
    isLoading: boolean;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    error: null,
    isLoading: true,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginRequest(state) {
            state.isLoading = true;
        },
        loginSuccess(state) {
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
        },
        logoutFailure(state, action: PayloadAction<string>) {
            state.error = action.payload;
            state.isLoading = false;
        },
        setAuthState(state, action: PayloadAction<boolean>) {
            state.isAuthenticated = action.payload;
        },
        checkAuthRequest(state) {
            state.isLoading = true;
        },
        checkAuthSuccess(state) {
            state.isAuthenticated = true;
            state.isLoading = false;
        },
        checkAuthFailure(state) {
            state.isAuthenticated = false;
            state.isLoading = false;
        },
    },
});

export const { loginRequest, loginSuccess, loginFailure, logoutSuccess, logoutFailure, logoutRequest, checkAuthRequest, checkAuthSuccess, checkAuthFailure, setAuthState } = authSlice.actions;
export default authSlice.reducer;