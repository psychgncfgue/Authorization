import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './favorites.entity';
import { FavoriteItem } from './favorites.item.entity';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { UserModule } from '../user/user.module';
import { ProductModule } from '../products/product.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Favorite, FavoriteItem]),
        UserModule,
        ProductModule,
    ],
    providers: [FavoritesService],
    controllers: [FavoritesController],
    exports: [FavoritesService],
})
export class FavoritesModule {}