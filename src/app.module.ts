/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantModule } from './restaurant/restaurant.module';
import { DishModule } from './dish/dish.module';
import { RestaurantDishModule } from './restaurant-dish/restaurant-dish.module';
import { RestaurantEntity } from './restaurant/restaurant.entity/restaurant.entity';
import { DishEntity } from './dish/dish.entity/dish.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RestaurantModule,
    DishModule,
    RestaurantDishModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: 'postgres',
      database: 'gestion_restaurantes',
      entities: [
        RestaurantEntity,
        DishEntity,
      ],
      dropSchema: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
