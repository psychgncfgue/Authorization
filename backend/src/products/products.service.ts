import {Injectable, NotFoundException} from '@nestjs/common';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {Category, Collection, Gender, Size} from '../../../enums/enums';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
    ) {}

    async findAll(): Promise<Product[]> {
        return this.productsRepository.find();
    }

    getUniqueProductsByName(products: Product[], page?: number): { data: Product[]; totalPages: number } {
        const uniqueNames = new Set<string>();
        const uniqueProducts: Product[] = [];

        for (const product of products) {
            if (!uniqueNames.has(product.name)) {
                uniqueNames.add(product.name);
                uniqueProducts.push(product);
            }
        }

        const itemsPerPage = 10;
        const totalPages = Math.ceil(uniqueProducts.length / itemsPerPage);

        if (page) {
            const startIndex = (page - 1) * itemsPerPage;
            const paginatedProducts = uniqueProducts.slice(startIndex, startIndex + itemsPerPage);
            return {
                data: paginatedProducts,
                totalPages,
            };
        }

        return {
            data: uniqueProducts,
            totalPages,
        };
    }

    async findByName(name: string): Promise<Product> {
        return this.productsRepository.findOne({ where: { name } });
    }

    async findOne(id: number): Promise<Product> {
        return this.productsRepository.findOneBy({ id });
    }

    async findByNameAndSize(name: string, size: string): Promise<Product | undefined> {
        const sizeEnum = Size[size as keyof typeof Size];
        if (!sizeEnum) {
            throw new Error('Invalid size');
        }
        return this.productsRepository.findOne({
            where: {
                name,
                size: sizeEnum,
            },
        });
    }

    async findByCategory(category: Category): Promise<Product[]> {
        return this.productsRepository.find({ where: { category } });
    }

    async findByCollection(collection: Collection): Promise<Product[]> {
        return this.productsRepository.find({ where: { collection } });
    }

    async findSortedByPrice(order: 'ASC' | 'DESC'): Promise<Product[]> {
        return this.productsRepository.find({
            order: {
                price: order,
            },
        });
    }

    async findByGender(gender: Gender): Promise<Product[]> {
        return this.productsRepository.find({ where: { gender } });
    }

    async countIdenticalProducts(
        name: string,
        category: Category,
        collection: Collection,
        gender: Gender,
        size: Size
    ): Promise<number> {
        try {
            const count = await this.productsRepository.count({
                where: {
                    name,
                    category,
                    collection,
                    gender,
                    size,
                },
            });

            if (count === 0) {
                throw new NotFoundException('Продукт не найден');
            }

            return count;
        } catch (error) {
            console.error('Error counting identical products:', error);
            throw error;
        }
    }

}