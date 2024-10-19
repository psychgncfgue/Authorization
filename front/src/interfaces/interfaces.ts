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
    quantity: number;
}

export interface FavoritesItem {
    id: string;
    product: Product;
}
