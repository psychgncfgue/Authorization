import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {Category, Collection, Gender, Size} from "../../../enums/enums";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({
        type: "enum",
        enum: Category,
    })
    category: Category;

    @Column({
        type: "enum",
        enum: Collection,
    })
    collection: Collection;

    @Column({ nullable: true })
    discount: number;

    @Column({ nullable: true })
    imageUrl: string;

    @Column({
        type: "enum",
        enum: Gender,
    })
    gender: Gender;

    @Column({
        type: "enum",
        enum: Size,
    })
    size: Size;

    @Column({
        type: "decimal",
        precision: 10,
        scale: 2,
    })
    price: string;
}