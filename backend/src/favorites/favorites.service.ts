import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Favorite } from './favorites.entity';
import { FavoriteItem } from './favorites.item.entity';
import { User } from '../user/user.entity';
import { Product } from '../products/product.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class FavoritesService {
    constructor(
        @InjectRepository(Favorite)
        private favoriteRepository: Repository<Favorite>,
        @InjectRepository(FavoriteItem)
        private favoriteItemRepository: Repository<FavoriteItem>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) {}

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async cleanOldFavorites() {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        await this.favoriteRepository.delete({
            updatedAt: LessThan(oneMonthAgo),
        });

        console.log('Old favorites cleaned up');
    }

    async getFavoritesByUserId(userId: string): Promise<Favorite> {
        const favorite = await this.favoriteRepository.findOne({
            where: { user: { id: userId } },
            relations: ['items', 'items.product'],
        });
        if (!favorite) {
            throw new NotFoundException('Favorites not found');
        }
        return favorite;
    }

    async addProductToFavorites(userId: string, productName: string): Promise<Favorite> {
        const product = await this.productRepository.findOne({ where: { name: productName } });
        if (!product) {
            throw new NotFoundException('Product not found');
        }

        let favorite = await this.getFavoritesByUserId(userId).catch(() => undefined);

        if (!favorite) {
            favorite = this.favoriteRepository.create({ user: { id: userId } as User });
            await this.favoriteRepository.save(favorite);
        }

        let favoriteItem = await this.favoriteItemRepository.findOne({
            where: { favorite: { id: favorite.id }, product: { id: product.id } },
        });

        if (!favoriteItem) {
            favoriteItem = this.favoriteItemRepository.create({
                favorite,
                product,
            });
            await this.favoriteItemRepository.save(favoriteItem);
        }

        return this.getFavoritesByUserId(userId);
    }

    async removeProductFromFavorites(userId: string, productName: string): Promise<Favorite> {
        const product = await this.productRepository.findOne({ where: { name: productName } });
        if (!product) {
            throw new NotFoundException('Product not found');
        }

        const favorite = await this.getFavoritesByUserId(userId);
        const favoriteItem = await this.favoriteItemRepository.findOne({
            where: { favorite: { id: favorite.id }, product: { id: product.id } },
        });

        if (favoriteItem) {
            await this.favoriteItemRepository.remove(favoriteItem);
        }

        return this.getFavoritesByUserId(userId);
    }

    async clearFavorites(userId: string): Promise<void> {
        const favorite = await this.getFavoritesByUserId(userId);
        await this.favoriteItemRepository.remove(favorite.items);
    }
}