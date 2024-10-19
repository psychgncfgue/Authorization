import {Controller, Get, NotFoundException, Param, Query} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { Category, Collection, Gender } from '../../../enums/enums'; // Импортируйте ваши перечисления

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Get()
    async findAll(): Promise<Product[]> {
        return this.productsService.findAll();
    }

    @Get('unique-names')
    async findAllWithUniqueNames(@Query('page') page?: string): Promise<{ data: Product[]; totalPages: number }> {
        const products = await this.productsService.findAll();
        const pageNumber = page ? parseInt(page, 10) : undefined;
        return this.productsService.getUniqueProductsByName(products, pageNumber);
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Product> {
        const product = await this.productsService.findOne(id);
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        return product;
    }

    @Get('name/:name')
    async findByName(@Param('name') name: string): Promise<Product> {
        const product = await this.productsService.findByName(name);
        if (!product) {
            throw new NotFoundException('Product with the specified name not found');
        }
        return product;
    }

    @Get('name/:name/size/:size')
    async findByNameAndSize(
        @Param('name') name: string,
        @Param('size') size: string,
    ): Promise<Product> {
        const product = await this.productsService.findByNameAndSize(name, size);
        if (!product) {
            throw new NotFoundException('Product with the specified name and size not found');
        }
        return product;
    }

    @Get('category/:category')
    async findByCategory(@Param('category') category: string): Promise<Product[]> {
        return this.productsService.findByCategory(Category[category as keyof typeof Category]);
    }

    @Get('collection/:collection')
    async findByCollection(@Param('collection') collection: string): Promise<Product[]> {
        return this.productsService.findByCollection(Collection[collection as keyof typeof Collection]);
    }

    @Get('sort/price')
    async findSortedByPrice(@Query('order') order: 'ASC' | 'DESC'): Promise<Product[]> {
        return this.productsService.findSortedByPrice(order);
    }

    @Get('gender/:gender')
    async findByGender(@Param('gender') gender: string): Promise<Product[]> {
        return this.productsService.findByGender(Gender[gender as keyof typeof Gender]);
    }

    @Get('filter')
    async findFiltered(
        @Query('category') category?: string,
        @Query('collection') collection?: string,
        @Query('order') orderByPrice?: 'ASC' | 'DESC',
        @Query('gender') gender?: string,
    ): Promise<Product[]> {
        return this.productsService.findFiltered(
            category ? (Category[category as keyof typeof Category] as Category) : undefined,
            collection ? (Collection[collection as keyof typeof Collection] as Collection) : undefined,
            orderByPrice,
            gender ? (Gender[gender as keyof typeof Gender] as Gender) : undefined,
        );
    }
}