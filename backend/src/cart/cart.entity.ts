import {Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, UpdateDateColumn} from 'typeorm';
import { User } from '../user/user.entity';
import {CartItem} from "./cart.item.entity";

@Entity()
export class Cart {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
    user: User;

    @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true })
    items: CartItem[];

    @UpdateDateColumn()
    updatedAt: Date;
}