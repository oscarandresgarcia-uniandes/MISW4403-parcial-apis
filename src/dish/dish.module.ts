import { Module } from '@nestjs/common';
import { DishService } from './dish.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DishEntity } from './dish.entity/dish.entity';
import { DishController } from './dish.controller';

@Module({
  providers: [DishService],
  imports: [TypeOrmModule.forFeature([DishEntity])],
  controllers: [DishController],
  exports: [DishService],
})
export class DishModule {}
