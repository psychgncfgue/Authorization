import {Category, Collection, Gender, Size} from "../../../enums/enums";

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    discount: number | null;
    category: Category;
    collection: Collection;
    gender: Gender;
    size: Size;
}

export interface FavoritesItem {
    id: string;
    product: Product;
}

export interface ProductData {
    name: string;
    category: string;
    collection: string;
    gender: string;
    size: string;
}

export interface CartItem {
    id: string;
    product: Product;
    quantity: number;
    totalQuantity: number;
}
