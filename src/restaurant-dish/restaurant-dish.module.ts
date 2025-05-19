import { Module } from '@nestjs/common';
import { RestaurantDishService } from './restaurant-dish.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantEntity } from '../restaurant/restaurant.entity/restaurant.entity';
import { DishEntity } from '../dish/dish.entity/dish.entity';
import { RestaurantDishController } from './restaurant-dish.controller';

@Module({
  providers: [RestaurantDishService],
  imports: [TypeOrmModule.forFeature([RestaurantEntity, DishEntity])],
  controllers: [RestaurantDishController],
})
export class RestaurantDishModule {}
