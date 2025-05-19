import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { DishEntity, DishCategory } from './dish.entity/dish.entity';
import { DishService } from './dish.service';
import { faker } from '@faker-js/faker';

describe('DishService', () => {
  let service: DishService;
  let repository: Repository<DishEntity>;
  let dishesList: DishEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [DishService],
    }).compile();

    service = module.get<DishService>(DishService);
    repository = module.get<Repository<DishEntity>>(
      getRepositoryToken(DishEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    dishesList = [];
    for (let i = 0; i < 5; i++) {
      const dish: DishEntity = {
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price({ min: 5, max: 100 })),
        dishCategory: DishCategory.MAIN,
        restaurants: [],
      };
      dishesList.push(dish);
      await repository.save(dish);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all dishes', async () => {
    const dishes: DishEntity[] = await service.findAll();
    expect(dishes).not.toBeNull();
    expect(dishes).toHaveLength(dishesList.length);
  });

  it('findOne should return a dish by id', async () => {
    const storedDish: DishEntity = dishesList[0];
    const dish: DishEntity = await service.findOne(storedDish.id);
    expect(dish).not.toBeNull();
    expect(dish.id).toEqual(storedDish.id);
    expect(dish.name).toEqual(storedDish.name);
    expect(dish.description).toEqual(storedDish.description);
    expect(dish.price).toEqual(storedDish.price);
    expect(dish.dishCategory).toEqual(storedDish.dishCategory);
  });

  it('findOne should throw an exception for an invalid dish', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'El plato con el id suministrado no fue encontrado',
    );
  });

  it('create should return a new dish', async () => {
    const dish: DishEntity = {
      id: '',
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price({ min: 5, max: 100 })),
      dishCategory: DishCategory.DESSERT,
      restaurants: [],
    };

    const newDish: DishEntity = await service.create(dish);
    expect(newDish).not.toBeNull();

    const storedDish: DishEntity = await repository.findOne({
      where: { id: newDish.id },
    });
    expect(storedDish).not.toBeNull();
    expect(storedDish.name).toEqual(newDish.name);
    expect(storedDish.description).toEqual(newDish.description);
    expect(storedDish.price).toEqual(newDish.price);
    expect(storedDish.dishCategory).toEqual(newDish.dishCategory);
  });

  it('create should throw an exception for an invalid price', async () => {
    const dish: DishEntity = {
      id: '',
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: -10,
      dishCategory: DishCategory.DESSERT,
      restaurants: [],
    };

    await expect(() => service.create(dish)).rejects.toHaveProperty(
      'message',
      'El precio del plato debe ser un número positivo',
    );
  });

  it('create should throw an exception for an invalid dish category', async () => {
    const dish: DishEntity = {
      id: '',
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price({ min: 5, max: 100 })),
      dishCategory: 'INVALID' as DishCategory,
      restaurants: [],
    };

    await expect(() => service.create(dish)).rejects.toHaveProperty(
      'message',
      'La categoría del plato debe ser: appetizer, main, dessert o drink',
    );
  });

  it('update should modify a dish', async () => {
    const dish: DishEntity = dishesList[0];
    dish.name = 'New Dish Name';
    dish.dishCategory = DishCategory.APPETIZER;

    const updatedDish: DishEntity = await service.update(dish.id, dish);
    expect(updatedDish).not.toBeNull();

    const storedDish: DishEntity = await repository.findOne({
      where: { id: dish.id },
    });
    expect(storedDish).not.toBeNull();
    expect(storedDish.name).toEqual(dish.name);
    expect(storedDish.dishCategory).toEqual(dish.dishCategory);
  });

  it('update should throw an exception for an invalid dish', async () => {
    let dish: DishEntity = dishesList[0];
    dish = {
      ...dish,
      name: 'New Dish Name',
    };
    await expect(() => service.update('0', dish)).rejects.toHaveProperty(
      'message',
      'El plato con el id suministrado no fue encontrado',
    );
  });

  it('update should throw an exception for an invalid price', async () => {
    const dish: DishEntity = dishesList[0];
    dish.price = -10;

    await expect(() => service.update(dish.id, dish)).rejects.toHaveProperty(
      'message',
      'El precio del plato debe ser un número positivo',
    );
  });

  it('update should throw an exception for an invalid dish category', async () => {
    const dish: DishEntity = dishesList[0];
    dish.dishCategory = 'INVALID' as DishCategory;

    await expect(() => service.update(dish.id, dish)).rejects.toHaveProperty(
      'message',
      'La categoría del plato debe ser: appetizer, main, dessert o drink',
    );
  });

  it('delete should remove a dish', async () => {
    const dish: DishEntity = dishesList[0];
    await service.delete(dish.id);

    const deletedDish: DishEntity = await repository.findOne({
      where: { id: dish.id },
    });
    expect(deletedDish).toBeNull();
  });

  it('delete should throw an exception for an invalid dish', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'El plato con el id suministrado no fue encontrado',
    );
  });
});
