/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantEntity } from '../../restaurant/restaurant.entity/restaurant.entity';
import { DishEntity } from '../../dish/dish.entity/dish.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [
      RestaurantEntity,
      DishEntity,
    ],
    synchronize: true,
  }),
  TypeOrmModule.forFeature([
    RestaurantEntity,
    DishEntity,
  ]),
];
