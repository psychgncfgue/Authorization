import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootReducer from '../reducers/rootReducer'; // Убедитесь, что путь правильный
import rootSaga from '../sagas/index'; // Убедитесь, что путь правильный
import { loginSuccess, logoutSuccess } from '../reducers/authSlice';
import axios from 'axios';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

// Проверяем, активна ли сессия
const checkSession = async () => {
    try {
        await axios.get('http://localhost:3000/auth/check', { withCredentials: true });
        store.dispatch(loginSuccess());
    } catch (error) {
        store.dispatch(logoutSuccess());
    }
};

// Инициализация проверки сессии
checkSession();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;