export const FETCH_PRODUCTS_REQUEST = 'FETCH_PRODUCTS_REQUEST';
export const FETCH_PRODUCT_BY_ID_REQUEST = 'FETCH_PRODUCT_BY_ID_REQUEST'



export const fetchProductsRequest = (page: number = 1) => ({
    type: FETCH_PRODUCTS_REQUEST,
    payload: { page },
});

export const fetchProductByIdRequest = (name: string, size: string) => ({
    type: 'FETCH_PRODUCT_BY_ID_REQUEST',
    payload: { name, size },
});