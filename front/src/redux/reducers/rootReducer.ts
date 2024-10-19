import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import productReducer from './productSlice'
import favoritesReducer from './favoritesSlice'
import productPageReducer from './productPageSlice'
import  carouselReducer from './carouselSlice'
import recommendationsReducer from './recommendationsSlice'

const rootReducer = combineReducers({
    auth: authReducer,
    product: productReducer,
    favorites: favoritesReducer,
    productPage: productPageReducer,
    carousel: carouselReducer,
    recommendations: recommendationsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;