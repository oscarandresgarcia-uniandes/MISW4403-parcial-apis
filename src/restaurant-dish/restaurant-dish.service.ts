import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RestaurantEntity } from '../restaurant/restaurant.entity/restaurant.entity';
import { DishEntity } from '../dish/dish.entity/dish.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class RestaurantDishService {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,

    @InjectRepository(DishEntity)
    private readonly dishRepository: Repository<DishEntity>,
  ) {}

  async addDishToRestaurant(
    restaurantId: string,
    dishId: string,
  ): Promise<RestaurantEntity> {
    const dish = await this.findDishById(dishId);
    const restaurant = await this.findRestaurantById(restaurantId);

    restaurant.dishes = [...restaurant.dishes, dish];
    return await this.restaurantRepository.save(restaurant);
  }

  async findDishesFromRestaurant(restaurantId: string): Promise<DishEntity[]> {
    const restaurant = await this.findRestaurantById(restaurantId);
    return restaurant.dishes;
  }

  async findDishFromRestaurant(
    restaurantId: string,
    dishId: string,
  ): Promise<DishEntity> {
    const dish = await this.findDishById(dishId);
    const restaurant = await this.findRestaurantById(restaurantId);

    const restaurantDish = this.findDishInRestaurant(restaurant, dishId);

    return restaurantDish;
  }

  async updateDishesFromRestaurant(
    restaurantId: string,
    dishes: DishEntity[],
  ): Promise<RestaurantEntity> {
    const restaurant = await this.findRestaurantById(restaurantId);

    for (const dish of dishes) {
      await this.findDishById(dish.id);
    }

    restaurant.dishes = dishes;
    return await this.restaurantRepository.save(restaurant);
  }

  async deleteDishFromRestaurant(
    restaurantId: string,
    dishId: string,
  ): Promise<void> {
    await this.findDishById(dishId);
    const restaurant = await this.findRestaurantById(restaurantId);

    this.findDishInRestaurant(restaurant, dishId);

    restaurant.dishes = restaurant.dishes.filter((dish) => dish.id !== dishId);
    await this.restaurantRepository.save(restaurant);
  }

  // Métodos privados reutilizables
  // Resuelven código duplicado

  private async findDishById(dishId: string): Promise<DishEntity> {
    const dish = await this.dishRepository.findOne({
      where: { id: dishId },
    });
    if (!dish) {
      throw new BusinessLogicException(
        'El plato con el id suministrado no ha sido encontrado',
        BusinessError.NOT_FOUND,
      );
    }
    return dish;
  }

  private async findRestaurantById(
    restaurantId: string,
  ): Promise<RestaurantEntity> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
      relations: ['dishes'],
    });
    if (!restaurant) {
      throw new BusinessLogicException(
        'El restaurante con el id suministrado no ha sido encontrado',
        BusinessError.NOT_FOUND,
      );
    }
    return restaurant;
  }

  private findDishInRestaurant(
    restaurant: RestaurantEntity,
    dishId: string,
  ): DishEntity {
    const dish = restaurant.dishes.find((d) => d.id === dishId);
    if (!dish) {
      throw new BusinessLogicException(
        'El plato con el id suministrado no está asociado al restaurante',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return dish;
  }
}
