import { call, put, takeLatest, all, takeEvery } from 'redux-saga/effects';
import axios, { AxiosResponse } from 'axios';
import {
    checkAuthFailure, checkAuthRequest,
    loginFailure,
    loginRequest,
    loginSuccess,
    logoutFailure,
    logoutRequest,
    logoutSuccess,
} from "../reducers/authSlice";
import {
    fetchProductsRequest,
    fetchProductsSuccess,
    fetchProductsFailure,
} from '../reducers/productSlice';
import {
    addToFavoritesFailure,
    addToFavoritesRequest,
    addToFavoritesSuccess, clearFavoritesFailure, clearFavoritesRequest, clearFavoritesSuccess,
    getFavoritesFailure,
    getFavoritesRequest, getFavoritesSuccess, removeFromFavoritesFailure, removeFromFavoritesRequest, removeFromFavoritesSuccess
} from "../reducers/favoritesSlice";
import {ADD_TO_FAVORITES, CLEAR_FAVORITES, FETCH_FAVORITES, REMOVE_FROM_FAVORITES} from "../actions/favoritesActions";
import {CartItem, FavoritesItem, Product, ProductData} from "../../interfaces/interfaces";
import {
    fetchProductPageFailure,
    fetchProductPageRequest,
    fetchProductPageSuccess,
    ProductPage
} from "../reducers/productPageSlice";
import {FETCH_PRODUCT_BY_ID_REQUEST} from "../actions/productActions";
import {
    fetchCarouselProductsFailure,
    fetchCarouselProductsRequest,
    fetchCarouselProductsSuccess
} from "../reducers/carouselSlice";
import {FETCH_CAROUSEL_REQUEST} from "../actions/carouselActions";
import {FETCH_RECOMMENDATIONS_REQUEST} from "../actions/recommendationsActions";
import {
    fetchRecommendationsFailure,
    fetchRecommendationsRequest,
    fetchRecommendationsSuccess
} from "../reducers/recommendationsSlice";
import {
    addToCartFailure,
    addToCartRequest,
    addToCartSuccess, checkQuantityFailure,
    checkQuantityRequest,
    checkQuantitySuccess,
    clearCartFailure,
    clearCartRequest,
    clearCartSuccess,
    fetchCartFailure,
    fetchCartRequest,
    fetchCartSuccess,
    removeFromCartFailure,
    removeFromCartRequest,
    removeFromCartSuccess
} from "../reducers/cartSlice";
import {ADD_TO_CART, CHECK_QUANTITY, CLEAR_CART, FETCH_CART, REMOVE_FROM_CART} from "../actions/cartActions";

interface LoginAction {
    type: string;
    payload: {
        userId: string;
        email: string;
        password: string;
    };
}


interface FavoritesResponse {
    id: string;
    updatedAt: string;
    items: FavoritesItem[];
}

function* loginSaga(action: LoginAction) {
    try {
        yield put(loginRequest());
        const response: AxiosResponse<{ userId: string; email: string; username: string }> = yield call(() =>
            axios.post('http://localhost:3000/auth/login', {
                email: action.payload.email,
                password: action.payload.password,
            }, { withCredentials: true })
        );
        const { userId, email, username } = response.data;
        yield put(loginSuccess({ userId, email, username }));
    } catch (error) {
        yield put(loginFailure('Не удалось войти. Проверьте email и пароль.'));
    }
}

function* logoutSaga() {
    try {
        yield put(logoutRequest());
        yield call(() => axios.post('http://localhost:3000/auth/logout', {}, { withCredentials: true }));

        yield put(logoutSuccess());
    } catch (error) {
        yield put(logoutFailure('Не удалось выйти. Попробуйте еще раз.'));
    }
}

function* checkAuthSaga() {
    try {
        yield put(checkAuthRequest());
        const response: AxiosResponse<{ userId: string; email: string; username: string }> = yield call(() =>
            axios.get('http://localhost:3000/auth/check', { withCredentials: true })
        );
        const { userId, email, username } = response.data;
        yield put(loginSuccess({ userId, email, username }));
    } catch (error) {
        yield put(checkAuthFailure());
        yield put(logoutSuccess());
    }
}

function* fetchProductsSaga(action: { type: string; payload: { page: number } }) {
    try {
        const { page } = action.payload;
        yield put(fetchProductsRequest());
        const response: AxiosResponse<{ data: Product[]; totalPages: number }> = yield call(() =>
            axios.get(`http://localhost:3000/products/unique-names?page=${page}`)
        );
        const { data, totalPages } = response.data;
        yield put(fetchProductsSuccess({ products: data, totalPages, currentPage: page }));
    } catch (error: any) {
        yield put(fetchProductsFailure(error.message));
    }
}

function* fetchRecommendationsSaga(action: { type: string; payload: { page: number } }) {
    try {
        const { page } = action.payload;
        yield put(fetchRecommendationsRequest());
        const response: AxiosResponse<{ data: Product[]; totalPages: number }> = yield call(() =>
            axios.get(`http://localhost:3000/products/unique-names?page=${page}`)
        );
        const { data } = response.data;
        yield put(fetchRecommendationsSuccess(data));
    } catch (error: any) {
        yield put(fetchRecommendationsFailure(error.message));
    }
}


function* fetchCarouselProductsSaga(action: { type: string; payload: { page: number } }) {
    try {
        yield put(fetchCarouselProductsRequest())
        const { page } = action.payload;
        const response: AxiosResponse<{ data: Product[]; totalPages: number }> = yield call(() =>
            axios.get(`http://localhost:3000/products/unique-names?page=${page}`)
        );
        yield put(fetchCarouselProductsSuccess(response.data.data));
    } catch (error) {
        yield put(fetchCarouselProductsFailure((error as Error).message));
    }
}

function* checkProductQuantity(action: {
    type: string;
    payload: {
        userId: string;
        productData: ProductData;
        id: string;
    };
}) {
    const { productData, id } = action.payload;
    const { name, category, collection, gender, size } = productData;
    try {
        yield put(checkQuantityRequest());
        console.log('Отправляемые данные:', productData);
        const response: AxiosResponse<{ count: number }> = yield call(() =>
            axios.get(`http://localhost:3000/products/check-quantity/${encodeURIComponent(name)}/${encodeURIComponent(category)}/${encodeURIComponent(collection)}/${encodeURIComponent(gender)}/${encodeURIComponent(size)}`)
        );

        yield put(checkQuantitySuccess({ id, count: response.data.count }));
    } catch (error: any) {
        yield put(checkQuantityFailure(error.message));
    }
}

function* checkCartQuantitiesSaga(action: { type: string; payload: { userId: string; productData: ProductData[]; cartItems: CartItem[] } }) {
    const { userId, productData, cartItems } = action.payload;

    if (productData && Array.isArray(productData)) {
        yield all(
            productData.map((product, index) =>
                call(checkProductQuantity, {
                    type: '',
                    payload: {
                        userId,
                        productData: product,
                        id: cartItems[index].id,
                    },
                })
            )
        );
    } else {
        console.error('productData не определены или не являются массивом', productData);
    }
}

function* addToCartSaga(action: { type: string; payload: { userId: string; productId: number } }) {
    const { userId, productId } = action.payload;
    try {
        yield put(addToCartRequest());
        const response: AxiosResponse<{ id: string; updatedAt: string; items: CartItem[] }> = yield call(() =>
            axios.post(`http://localhost:3000/cart/${userId}/add`, {
                productId,
            })
        );
        yield put(addToCartSuccess(response.data));
    } catch (error: any) {
        yield put(addToCartFailure(error.message));
    }
}

function* fetchCartSaga(action: { type: string; payload: string }) {
    try {
        yield put(fetchCartRequest());
        const userId = action.payload;
        const response: AxiosResponse<{ items: CartItem[] }> = yield call(() =>
            axios.get(`http://localhost:3000/cart/${userId}`)
        );
        yield put(fetchCartSuccess(response.data.items));
    } catch (error: any) {
        yield put(fetchCartFailure(error.message));
    }
}

function* removeFromCartSaga(action: { type: string; payload: { userId: string; productId: number } }) {
    const { userId, productId } = action.payload;
    try {
        yield put(removeFromCartRequest());
        const response: AxiosResponse<CartItem[]> = yield call(() =>
            axios.delete(`http://localhost:3000/cart/${userId}/remove/${productId}`)
        );
        yield put(removeFromCartSuccess(response.data));
    } catch (error: any) {
        yield put(removeFromCartFailure(error.message));
    }
}

function* clearCartSaga(action: { type: string; payload: string }) {
    const userId = action.payload;
    try {
        yield put(clearCartRequest());
        yield call(() =>
            axios.delete(`http://localhost:3000/cart/${userId}/clear`)
        );
        yield put(clearCartSuccess());
    } catch (error: any) {
        yield put(clearCartFailure(error.message));
    }
}

function* addToFavorites(action: { type: string; payload: { userId: string; productName: string } }) {
    const { userId, productName } = action.payload;
    try {
        yield put(addToFavoritesRequest(productName));
        yield call(() =>
            axios.post(`http://localhost:3000/favorites/${userId}/add`, {
                productName,
            })
        );
        yield put(addToFavoritesSuccess(productName));
    } catch (error: any) {
        yield put(addToFavoritesFailure({ productId: productName, error: error.message }));
    }
}

function* addToFavoritesSaga(action: { type: string; payload: { userId: string; productNames: string[] } }) {
    const { userId, productNames } = action.payload;
    yield all(productNames.map(productName => call(addToFavorites, { type: '', payload: { userId, productName } })));
}

function* fetchFavorites(action: { type: string; payload: string }) {
    try {
        yield put(getFavoritesRequest());
        const userId = action.payload;
        const response: AxiosResponse<FavoritesResponse> = yield call(() =>
            axios.get(`http://localhost:3000/favorites/${userId}`)
        );
        yield put(getFavoritesSuccess(response.data));
    } catch (error: any) {
        yield put(getFavoritesFailure(error.message));
    }
}

function* removeFromFavoritesSaga(action: { type: string; payload: { userId: string; productName: string; } }) {
    try {
        const { userId, productName } = action.payload;
        yield put(removeFromFavoritesRequest(productName));
        yield call(axios.delete, `http://localhost:3000/favorites/${userId}/remove/${productName}`);
        const response: AxiosResponse<FavoritesResponse> = yield call(() =>
            axios.get(`http://localhost:3000/favorites/${userId}`)
        );
        yield put(removeFromFavoritesSuccess(productName));
        yield put(getFavoritesSuccess(response.data));
    } catch (error: any) {
        yield put(getFavoritesFailure(error.message));
        yield put(removeFromFavoritesFailure(error.message));
    }
}

export function* clearFavorites(action: { type: string; payload: string }) {
    try {
        yield put(clearFavoritesRequest());
        const userId = action.payload;
        yield call(axios.delete, `http://localhost:3000/favorites/${userId}/clear`);

        yield put(clearFavoritesSuccess());
    } catch (error: any) {
        yield put(clearFavoritesFailure(error.message));
    }
}

export function* fetchProductPage(action: { type: string; payload: {name: string, size: string} } ) {
    try {
        yield put(fetchProductPageRequest())
        const { name, size } = action.payload
        const response: AxiosResponse<ProductPage> = yield call(axios.get, `http://localhost:3000/products/name/${name}/size/${size}`);
        yield put(fetchProductPageSuccess(response.data));
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            yield put(fetchProductPageFailure('Product not found'));
        } else {
            yield put(fetchProductPageFailure('Failed to fetch product'));
        }
    }
}


export function* watchFetchProducts() {
    yield takeLatest('FETCH_PRODUCTS_REQUEST', fetchProductsSaga);
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

function* watchAddToCard() {
    yield takeEvery(ADD_TO_FAVORITES, addToFavoritesSaga);
}

function* watchFetchCard() {
    yield takeLatest(FETCH_FAVORITES, fetchFavorites)
}

export function* watchRemoveFromCard() {
    yield takeLatest(REMOVE_FROM_FAVORITES, removeFromFavoritesSaga);
}

export function* watchClearCard() {
    yield takeLatest(CLEAR_FAVORITES, clearFavorites)
}

export function* watchFetchProductPage() {
    yield takeLatest(FETCH_PRODUCT_BY_ID_REQUEST, fetchProductPage)
}

export function* watchCarouselProducts() {
    yield takeLatest(FETCH_CAROUSEL_REQUEST, fetchCarouselProductsSaga);
}

export function* watchFetchRecommendations() {
    yield takeLatest(FETCH_RECOMMENDATIONS_REQUEST, fetchRecommendationsSaga);
}

function* watchCheckQuantity() {
    yield takeLatest(CHECK_QUANTITY, checkCartQuantitiesSaga);
}

export function* watchCartSagas() {
    yield takeLatest(ADD_TO_CART, addToCartSaga);
    yield takeLatest(FETCH_CART, fetchCartSaga);
    yield takeLatest(REMOVE_FROM_CART, removeFromCartSaga);
    yield takeLatest(CLEAR_CART, clearCartSaga);
}

export default function* rootSaga() {
    yield all([
        watchLoginSaga(),
        watchLogoutSaga(),
        watchCheckAuthSaga(),
        watchFetchProducts(),
        watchAddToCard(),
        watchFetchCard(),
        watchRemoveFromCard(),
        watchClearCard(),
        watchFetchProductPage(),
        watchCarouselProducts(),
        watchFetchRecommendations(),
        watchCartSagas(),
        watchCheckQuantity()
    ]);
}
