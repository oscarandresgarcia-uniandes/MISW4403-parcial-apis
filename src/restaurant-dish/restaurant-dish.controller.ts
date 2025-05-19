import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { RestaurantDishService } from './restaurant-dish.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { DishEntity } from '../dish/dish.entity/dish.entity';
import { plainToInstance } from 'class-transformer';

@Controller('restaurants/:restaurantId/dishes')
@UseInterceptors(BusinessErrorsInterceptor)
export class RestaurantDishController {
  constructor(private readonly restaurantDishService: RestaurantDishService) {}

  @Post(':dishId')
  async addDishToRestaurant(
    @Param('restaurantId') restaurantId: string,
    @Param('dishId') dishId: string,
  ) {
    return await this.restaurantDishService.addDishToRestaurant(
      restaurantId,
      dishId,
    );
  }

  @Get()
  async findDishesFromRestaurant(@Param('restaurantId') restaurantId: string) {
    return await this.restaurantDishService.findDishesFromRestaurant(
      restaurantId,
    );
  }

  @Get(':dishId')
  async findDishFromRestaurant(
    @Param('restaurantId') restaurantId: string,
    @Param('dishId') dishId: string,
  ) {
    return await this.restaurantDishService.findDishFromRestaurant(
      restaurantId,
      dishId,
    );
  }

  @Put()
  async updateDishesFromRestaurant(
    @Param('restaurantId') restaurantId: string,
    @Body() dishesDto: DishEntity[],
  ) {
    const dishes = plainToInstance(DishEntity, dishesDto);
    return await this.restaurantDishService.updateDishesFromRestaurant(
      restaurantId,
      dishes,
    );
  }

  @Delete(':dishId')
  @HttpCode(204)
  async deleteDishFromRestaurant(
    @Param('restaurantId') restaurantId: string,
    @Param('dishId') dishId: string,
  ) {
    return await this.restaurantDishService.deleteDishFromRestaurant(
      restaurantId,
      dishId,
    );
  }
}
