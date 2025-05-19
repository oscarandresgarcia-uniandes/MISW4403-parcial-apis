/* eslint-disable prettier/prettier */
import { DishEntity } from '../../dish/dish.entity/dish.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum CuisineType {
  ITALIAN = 'Italian',
  COLOMBIAN = 'Colombian',
  MEXICAN = 'Mexican',
  JAPANESE = 'Japanese',
  INDIAN = 'Indian',
  INTERNATIONAL = 'International'
}

@Entity()
export class RestaurantEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  page: string;

  @Column()
  cuisineType: string;

  @ManyToMany(() => DishEntity, dish => dish.restaurants)
  @JoinTable()
  dishes: DishEntity[];
}
