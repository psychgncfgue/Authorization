import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
export class FavoritesController {
    constructor(private readonly favoritesService: FavoritesService) {}

    @Get(':userId')
    async getFavorites(@Param('userId') userId: string) {
        return this.favoritesService.getFavoritesByUserId(userId);
    }

    @Post(':userId/add')
    async addProduct(
        @Param('userId') userId: string,
        @Body() addItemDto: { productName: string },
    ) {
        const { productName } = addItemDto;
        return this.favoritesService.addProductToFavorites(userId, productName);
    }

    @Delete(':userId/remove/:productName')
    async removeProduct(
        @Param('userId') userId: string,
        @Param('productName') productName: string,
    ) {
        return this.favoritesService.removeProductFromFavorites(userId, productName);
    }

    @Delete(':userId/clear')
    async clearFavorites(@Param('userId') userId: string) {
        await this.favoritesService.clearFavorites(userId);
        return { message: 'Favorites cleared' };
    }
}