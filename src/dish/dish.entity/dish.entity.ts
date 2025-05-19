/* eslint-disable prettier/prettier */
import { RestaurantEntity } from '../../restaurant/restaurant.entity/restaurant.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum DishCategory {
  APPETIZER = 'appetizer',
  MAIN = 'main',
  DESSERT = 'dessert',
  DRINK = 'drink'
}

@Entity()
export class DishEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({
    type: 'enum',
    enum: DishCategory,
    default: DishCategory.MAIN
  })
  dishCategory: DishCategory;

  @ManyToMany(() => RestaurantEntity, restaurant => restaurant.dishes)
  restaurants: RestaurantEntity[];
}
