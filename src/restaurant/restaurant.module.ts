import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantEntity } from './restaurant.entity/restaurant.entity';
import { RestaurantController } from './restaurant.controller';

@Module({
  providers: [RestaurantService],
  imports: [TypeOrmModule.forFeature([RestaurantEntity])],
  controllers: [RestaurantController],
  exports: [RestaurantService],
})
export class RestaurantModule {}
