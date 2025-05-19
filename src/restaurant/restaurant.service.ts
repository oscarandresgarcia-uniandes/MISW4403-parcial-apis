import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  RestaurantEntity,
  CuisineType,
} from './restaurant.entity/restaurant.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,
  ) {}

  async findAll(): Promise<RestaurantEntity[]> {
    return this.restaurantRepository.find({ relations: ['dishes'] });
  }

  async findOne(id: string): Promise<RestaurantEntity> {
    const restaurant: RestaurantEntity =
      await this.restaurantRepository.findOne({
        where: { id },
        relations: ['dishes'],
      });

    if (!restaurant)
      throw new BusinessLogicException(
        'El restaurante con el id suministrado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    return restaurant;
  }

  async create(restaurant: RestaurantEntity): Promise<RestaurantEntity> {
    // Validar que el tipo de cocina sea válido
    if (!this.isValidCuisineType(restaurant.cuisineType)) {
      throw new BusinessLogicException(
        'El tipo de cocina debe ser: Italian, Colombian, Mexican, Japanese, Indian o International',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    // Validaciones de campos obligatorios
    if (!restaurant.name || !restaurant.address || !restaurant.page) {
      throw new BusinessLogicException(
        'Todos los campos del restaurante son obligatorios',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return await this.restaurantRepository.save(restaurant);
  }

  async update(
    id: string,
    restaurant: RestaurantEntity,
  ): Promise<RestaurantEntity> {
    const persistedRestaurant: RestaurantEntity =
      await this.restaurantRepository.findOne({ where: { id } });
    if (!persistedRestaurant)
      throw new BusinessLogicException(
        'El restaurante con el id suministrado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    // Validar que el tipo de cocina sea válido
    if (
      restaurant.cuisineType &&
      !this.isValidCuisineType(restaurant.cuisineType)
    ) {
      throw new BusinessLogicException(
        'El tipo de cocina debe ser: Italian, Colombian, Mexican, Japanese, Indian o International',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return await this.restaurantRepository.save({
      ...persistedRestaurant,
      ...restaurant,
    });
  }

  async delete(id: string) {
    const restaurant: RestaurantEntity =
      await this.restaurantRepository.findOne({
        where: { id },
      });
    if (!restaurant)
      throw new BusinessLogicException(
        'El restaurante con el id suministrado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    await this.restaurantRepository.remove(restaurant);
  }

  private isValidCuisineType(cuisineType: CuisineType): boolean {
    return Object.values(CuisineType).includes(cuisineType);
  }
}
