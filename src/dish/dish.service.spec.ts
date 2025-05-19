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
        dishCategory: DishCategory.MAIN.toString(),
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
  });

  it('create should return a new dish', async () => {
    const dish: DishEntity = {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price({ min: 5, max: 100 })),
      dishCategory: DishCategory.DESSERT,
      restaurants: [],
    };

    const newDish: DishEntity = await service.create(dish);
    expect(newDish).not.toBeNull();
  });

  it('create should throw an exception for an invalid price', async () => {
    const dish: DishEntity = {
      id: faker.string.uuid(),
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

  it('update should modify a dish', async () => {
    const dish: DishEntity = dishesList[0];
    dish.name = 'New Dish Name';
    dish.dishCategory = DishCategory.APPETIZER;

    const updatedDish: DishEntity = await service.update(dish.id, dish);
    expect(updatedDish).not.toBeNull();
    expect(updatedDish.name).toEqual('New Dish Name');
  });

  it('delete should remove a dish', async () => {
    const dish: DishEntity = dishesList[0];
    await service.delete(dish.id);

    const deletedDish: DishEntity = await repository.findOne({
      where: { id: dish.id },
    });
    expect(deletedDish).toBeNull();
  });
});
