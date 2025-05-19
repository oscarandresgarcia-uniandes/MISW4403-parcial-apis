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
import { RestaurantService } from './restaurant.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { RestaurantDto } from './restaurant.dto';
import { RestaurantEntity } from './restaurant.entity/restaurant.entity';
import { plainToInstance } from 'class-transformer';

@Controller('restaurants')
@UseInterceptors(BusinessErrorsInterceptor)
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get()
  async findAll() {
    return await this.restaurantService.findAll();
  }

  @Get(':restaurantId')
  async findOne(@Param('restaurantId') restaurantId: string) {
    return await this.restaurantService.findOne(restaurantId);
  }

  @Post()
  async create(@Body() restaurantDto: RestaurantDto) {
    const restaurant: RestaurantEntity = plainToInstance(
      RestaurantEntity,
      restaurantDto,
    );
    return await this.restaurantService.create(restaurant);
  }

  @Put(':restaurantId')
  async update(
    @Param('restaurantId') restaurantId: string,
    @Body() restaurantDto: RestaurantDto,
  ) {
    const restaurant: RestaurantEntity = plainToInstance(
      RestaurantEntity,
      restaurantDto,
    );
    return await this.restaurantService.update(restaurantId, restaurant);
  }

  @Delete(':restaurantId')
  @HttpCode(204)
  async delete(@Param('restaurantId') restaurantId: string) {
    return await this.restaurantService.delete(restaurantId);
  }
}
