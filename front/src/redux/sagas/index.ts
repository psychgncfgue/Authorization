import { call, put, takeLatest, all } from 'redux-saga/effects';
import axios from 'axios';
import {
    checkAuthFailure, checkAuthRequest, checkAuthSuccess,
    loginFailure,
    loginRequest,
    loginSuccess,
    logoutFailure,
    logoutRequest,
    logoutSuccess,
} from "../reducers/authSlice";

interface LoginAction {
    type: string;
    payload: {
        email: string;
        password: string;
    };
}

function* loginSaga(action: LoginAction) {
    try {
        yield put(loginRequest());

        yield call(() => axios.post('http://localhost:3000/auth/login', {
            email: action.payload.email,
            password: action.payload.password,
        }, { withCredentials: true }));

        // Диспатчим успешный вход
        yield put(loginSuccess());
    } catch (error) {
        yield put(loginFailure('Не удалось войти. Проверьте email и пароль.'));
    }
}

function* logoutSaga() {
    try {
        yield put(logoutRequest());

        // Запрос на выход
        yield call(() => axios.post('http://localhost:3000/auth/logout', {}, { withCredentials: true }));

        yield put(logoutSuccess());
    } catch (error) {
        yield put(logoutFailure('Не удалось выйти. Попробуйте еще раз.'));
    }
}

function* checkAuthSaga() {
    try {
        yield put(checkAuthRequest());
        yield call(() => axios.get('http://localhost:3000/auth/check', { withCredentials: true }));
        yield put(checkAuthSuccess());
    } catch (error) {
        yield put(checkAuthFailure());
    }
}

function* watchLoginSaga() {
    yield takeLatest('LOGIN_REQUEST', loginSaga);
}

function* watchLogoutSaga() {
    yield takeLatest('LOGOUT_REQUEST', logoutSaga);
}

function* watchCheckAuthSaga() {
    yield takeLatest('CHECK_AUTH', checkAuthSaga);
}
export default function* rootSaga() {
    yield all([
        watchLoginSaga(),
        watchLogoutSaga(),
        watchCheckAuthSaga(),
    ]);
}
