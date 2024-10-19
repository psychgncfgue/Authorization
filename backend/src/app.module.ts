import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { typeOrmConfig } from '@config/typeorm.config';
import { ProductModule } from './products/product.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CartModule } from './cart/cart.module';
import { FavoritesModule } from './favorites/favorites.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(typeOrmConfig),
        AuthModule,
        UserModule,
        ProductModule,
        CartModule,
        FavoritesModule,
        ScheduleModule.forRoot(),
    ],
})
export class AppModule {}