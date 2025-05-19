import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DishEntity, DishCategory } from './dish.entity/dish.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class DishService {
  constructor(
    @InjectRepository(DishEntity)
    private readonly dishRepository: Repository<DishEntity>,
  ) {}

  async findAll(): Promise<DishEntity[]> {
    return this.dishRepository.find({ relations: ['restaurants'] });
  }

  async findOne(id: string): Promise<DishEntity> {
    const dish: DishEntity = await this.dishRepository.findOne({
      where: { id },
      relations: ['restaurants'],
    });

    if (!dish)
      throw new BusinessLogicException(
        'El plato con el id suministrado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    return dish;
  }

  async create(dish: DishEntity): Promise<DishEntity> {
    // Validar que el precio sea positivo
    if (dish.price <= 0) {
      throw new BusinessLogicException(
        'El precio del plato debe ser un número positivo',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    // Validar que la categoría sea válida
    if (!this.isValidDishCategory(dish.dishCategory)) {
      throw new BusinessLogicException(
        'La categoría del plato debe ser: appetizer, main, dessert o drink',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    // Validaciones de campos obligatorios
    if (!dish.name || !dish.description) {
      throw new BusinessLogicException(
        'El nombre y la descripción del plato son obligatorios',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return await this.dishRepository.save(dish);
  }

  async update(id: string, dish: DishEntity): Promise<DishEntity> {
    const persistedDish: DishEntity = await this.dishRepository.findOne({
      where: { id },
    });
    if (!persistedDish)
      throw new BusinessLogicException(
        'El plato con el id suministrado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    // Validar que el precio sea positivo si se está actualizando
    if (dish.price !== undefined && dish.price <= 0) {
      throw new BusinessLogicException(
        'El precio del plato debe ser un número positivo',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    // Validar que la categoría sea válida si se está actualizando
    if (dish.dishCategory && !this.isValidDishCategory(dish.dishCategory)) {
      throw new BusinessLogicException(
        'La categoría del plato debe ser: appetizer, main, dessert o drink',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return await this.dishRepository.save({
      ...persistedDish,
      ...dish,
    });
  }

  async delete(id: string) {
    const dish: DishEntity = await this.dishRepository.findOne({
      where: { id },
    });
    if (!dish)
      throw new BusinessLogicException(
        'El plato con el id suministrado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    await this.dishRepository.remove(dish);
  }

  private isValidDishCategory(category: DishCategory): boolean {
    return Object.values(DishCategory).includes(category);
  }
}
