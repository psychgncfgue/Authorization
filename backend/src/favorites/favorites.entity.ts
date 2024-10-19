import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, UpdateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { FavoriteItem } from './favorites.item.entity';

@Entity()
export class Favorite {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
    user: User;

    @OneToMany(() => FavoriteItem, (favoriteItem) => favoriteItem.favorite, { cascade: true })
    items: FavoriteItem[];

    @UpdateDateColumn()
    updatedAt: Date;
}