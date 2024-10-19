export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const CHECK_AUTH = 'CHECK_AUTH';

export const loginRequest = (email: string, password: string) => ({
    type: LOGIN_REQUEST,
    payload: { email, password },
});

export const logoutRequest = () => ({
    type: LOGOUT_REQUEST,
});

export const checkAuth = () => ({
    type: CHECK_AUTH,
});



