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
import { DishService } from './dish.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { DishDto } from './dish.dto';
import { DishEntity } from './dish.entity/dish.entity';
import { plainToInstance } from 'class-transformer';

@Controller('dishes')
@UseInterceptors(BusinessErrorsInterceptor)
export class DishController {
  constructor(private readonly dishService: DishService) {}

  @Get()
  async findAll() {
    return await this.dishService.findAll();
  }

  @Get(':dishId')
  async findOne(@Param('dishId') dishId: string) {
    return await this.dishService.findOne(dishId);
  }

  @Post()
  async create(@Body() dishDto: DishDto) {
    const dish: DishEntity = plainToInstance(DishEntity, dishDto);
    return await this.dishService.create(dish);
  }

  @Put(':dishId')
  async update(@Param('dishId') dishId: string, @Body() dishDto: DishDto) {
    const dish: DishEntity = plainToInstance(DishEntity, dishDto);
    return await this.dishService.update(dishId, dish);
  }

  @Delete(':dishId')
  @HttpCode(204)
  async delete(@Param('dishId') dishId: string) {
    return await this.dishService.delete(dishId);
  }
}
