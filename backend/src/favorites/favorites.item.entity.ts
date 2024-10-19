import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Favorite } from './favorites.entity';
import { Product } from '../products/product.entity';

@Entity()
export class FavoriteItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Favorite, (favorite) => favorite.items, { onDelete: 'CASCADE' })
    favorite: Favorite;

    @ManyToOne(() => Product, { eager: true })
    product: Product;
}