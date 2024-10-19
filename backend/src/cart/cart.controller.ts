import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { CartService } from './cart.service';
import { Product } from '../products/product.entity';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Get(':userId')
    async getCart(@Param('userId') userId: string) {
        return this.cartService.getCartByUserId(userId);
    }

    @Post(':userId/add')
    async addItem(
        @Param('userId') userId: string,
        @Body() addItemDto: { productId: number;  },
    ) {
        const { productId } = addItemDto;
        const product = new Product();
        product.id = productId;

        return this.cartService.addItemToCart(userId, product);
    }

    @Delete(':userId/remove/:productId')
    async removeItem(
        @Param('userId') userId: string,
        @Param('productId') productId: number,
    ) {
        return this.cartService.removeItemFromCart(userId, productId);
    }

    @Delete(':userId/clear')
    async clearCart(@Param('userId') userId: string) {
        await this.cartService.clearCart(userId);
        return { message: 'Cart cleared' };
    }
}