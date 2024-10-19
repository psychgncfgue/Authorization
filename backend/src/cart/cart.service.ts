import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {LessThan, Repository} from 'typeorm';
import { Cart } from './cart.entity';
import { CartItem } from './cart.item.entity';
import { User } from '../user/user.entity';
import { Product } from '../products/product.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private cartRepository: Repository<Cart>,
        @InjectRepository(CartItem)
        private cartItemRepository: Repository<CartItem>,
    ) {}

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async cleanOldCarts() {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        await this.cartRepository.delete({
            updatedAt: LessThan(oneMonthAgo),
        });

        console.log('Old carts cleaned up');
    }

    async getCartByUserId(userId: string): Promise<Cart> {
        const cart = await this.cartRepository.findOne({
            where: { user: { id: userId } },
            relations: ['items', 'items.product'],
        });
        if (!cart) {
            throw new NotFoundException('Cart not found');
        }
        return cart;
    }

    async addItemToCart(userId: string, product: Product): Promise<Cart> {
        let cart = await this.getCartByUserId(userId).catch(() => undefined);

        if (!cart) {
            cart = this.cartRepository.create({ user: { id: userId } as User });
            await this.cartRepository.save(cart);
        }

        let cartItem = await this.cartItemRepository.findOne({
            where: { cart: { id: cart.id }, product: { id: product.id } },
        });

        if (cartItem) {
        } else {
            cartItem = this.cartItemRepository.create({
                cart,
                product,
            });
        }

        await this.cartItemRepository.save(cartItem);
        return this.getCartByUserId(userId);
    }

    async removeItemFromCart(userId: string, productId: number): Promise<Cart> {
        const cart = await this.getCartByUserId(userId);
        const cartItem = await this.cartItemRepository.findOne({
            where: { cart: { id: cart.id }, product: { id: productId } },
        });

        if (cartItem) {
            await this.cartItemRepository.remove(cartItem);
        }

        return this.getCartByUserId(userId);
    }

    async clearCart(userId: string): Promise<void> {
        const cart = await this.getCartByUserId(userId);
        await this.cartItemRepository.remove(cart.items);
    }
}