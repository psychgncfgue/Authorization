import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { CartItem } from './cart.item.entity';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { UserModule } from '../user/user.module';
import { ProductModule } from '../products/product.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Cart, CartItem]),
        UserModule,
        ProductModule,
    ],
    providers: [CartService],
    controllers: [CartController],
    exports: [CartService],
})
export class CartModule {}