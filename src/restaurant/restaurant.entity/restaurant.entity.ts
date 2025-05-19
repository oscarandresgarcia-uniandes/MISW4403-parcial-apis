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

  @Column({
    type: 'enum',
    enum: CuisineType,
    default: CuisineType.INTERNATIONAL
  })
  cuisineType: CuisineType;

  @ManyToMany(() => DishEntity, dish => dish.restaurants)
  @JoinTable()
  dishes: DishEntity[];
}
