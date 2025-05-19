import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import {
  RestaurantEntity,
  CuisineType,
} from '../restaurant/restaurant.entity/restaurant.entity';
import { DishEntity, DishCategory } from '../dish/dish.entity/dish.entity';
import { RestaurantDishService } from './restaurant-dish.service';
import { faker } from '@faker-js/faker';
import { BusinessLogicException } from '../shared/errors/business-errors';

describe('RestaurantDishService', () => {
  let service: RestaurantDishService;
  let restaurantRepository: Repository<RestaurantEntity>;
  let dishRepository: Repository<DishEntity>;
  let restaurant: RestaurantEntity;
  let dishesList: DishEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RestaurantDishService],
    }).compile();

    service = module.get<RestaurantDishService>(RestaurantDishService);
    restaurantRepository = module.get<Repository<RestaurantEntity>>(
      getRepositoryToken(RestaurantEntity),
    );
    dishRepository = module.get<Repository<DishEntity>>(
      getRepositoryToken(DishEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    dishRepository.clear();
    restaurantRepository.clear();

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
      await dishRepository.save(dish);
    }

    restaurant = {
      id: faker.string.uuid(),
      name: faker.company.name(),
      address: faker.location.streetAddress(),
      page: faker.internet.url(),
      cuisineType: CuisineType.ITALIAN,
      dishes: dishesList,
    };
    await restaurantRepository.save(restaurant);
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addDishToRestaurant should add a dish to a restaurant', async () => {
    const newDish: DishEntity = {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price({ min: 5, max: 100 })),
      dishCategory: DishCategory.DESSERT,
      restaurants: [],
    };
    await dishRepository.save(newDish);

    const newRestaurant: RestaurantEntity = {
      id: faker.string.uuid(),
      name: faker.company.name(),
      address: faker.location.streetAddress(),
      page: faker.internet.url(),
      cuisineType: CuisineType.MEXICAN,
      dishes: [],
    };
    await restaurantRepository.save(newRestaurant);

    const result: RestaurantEntity = await service.addDishToRestaurant(
      newRestaurant.id,
      newDish.id,
    );

    expect(result.dishes).not.toBeNull();
    expect(result.dishes.length).toBe(1);
    expect(result.dishes[0].id).toBe(newDish.id);
  });

  it('addDishToRestaurant should throw exception for non-existent restaurant', async () => {
    const newDish: DishEntity = dishesList[0];
    await expect(() =>
      service.addDishToRestaurant('0', newDish.id),
    ).rejects.toHaveProperty(
      'message',
      'El restaurante con el id suministrado no ha sido encontrado',
    );
  });

  it('addDishToRestaurant should throw exception for non-existent dish', async () => {
    await expect(() =>
      service.addDishToRestaurant(restaurant.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El plato con el id suministrado no ha sido encontrado',
    );
  });

  it('findDishesFromRestaurant should return dishes by restaurant', async () => {
    const dishes: DishEntity[] = await service.findDishesFromRestaurant(
      restaurant.id,
    );
    expect(dishes).not.toBeNull();
    expect(dishes.length).toBe(dishesList.length);
  });

  it('findDishesFromRestaurant should throw exception for non-existent restaurant', async () => {
    await expect(() =>
      service.findDishesFromRestaurant('0'),
    ).rejects.toHaveProperty(
      'message',
      'El restaurante con el id suministrado no ha sido encontrado',
    );
  });

  it('findDishFromRestaurant should return a dish by restaurant', async () => {
    const dish: DishEntity = dishesList[0];
    const foundDish: DishEntity = await service.findDishFromRestaurant(
      restaurant.id,
      dish.id,
    );
    expect(foundDish).not.toBeNull();
    expect(foundDish.id).toBe(dish.id);
  });

  it('findDishFromRestaurant should throw exception for non-existent restaurant', async () => {
    const dish: DishEntity = dishesList[0];
    await expect(() =>
      service.findDishFromRestaurant('0', dish.id),
    ).rejects.toHaveProperty(
      'message',
      'El restaurante con el id suministrado no ha sido encontrado',
    );
  });

  it('findDishFromRestaurant should throw exception for non-existent dish', async () => {
    await expect(() =>
      service.findDishFromRestaurant(restaurant.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El plato con el id suministrado no ha sido encontrado',
    );
  });

  it('findDishFromRestaurant should throw exception for dish not associated to restaurant', async () => {
    const newDish: DishEntity = {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price({ min: 5, max: 100 })),
      dishCategory: DishCategory.DESSERT,
      restaurants: [],
    };
    await dishRepository.save(newDish);

    await expect(() =>
      service.findDishFromRestaurant(restaurant.id, newDish.id),
    ).rejects.toHaveProperty(
      'message',
      'El plato con el id suministrado no está asociado al restaurante',
    );
  });

  it('updateDishesFromRestaurant should update dishes list', async () => {
    const newDishesList = dishesList.slice(0, 2);

    const updatedRestaurant: RestaurantEntity =
      await service.updateDishesFromRestaurant(restaurant.id, newDishesList);
    expect(updatedRestaurant).not.toBeNull();
    expect(updatedRestaurant.dishes.length).toBe(2);
    expect(updatedRestaurant.dishes[0].id).toBe(dishesList[0].id);
    expect(updatedRestaurant.dishes[1].id).toBe(dishesList[1].id);
  });

  it('updateDishesFromRestaurant should throw exception for non-existent restaurant', async () => {
    await expect(() =>
      service.updateDishesFromRestaurant('0', dishesList),
    ).rejects.toHaveProperty(
      'message',
      'El restaurante con el id suministrado no ha sido encontrado',
    );
  });

  it('deleteDishFromRestaurant should remove a dish from restaurant', async () => {
    const dish: DishEntity = dishesList[0];

    await service.deleteDishFromRestaurant(restaurant.id, dish.id);

    const storedRestaurant: RestaurantEntity =
      await restaurantRepository.findOne({
        where: { id: restaurant.id },
        relations: ['dishes'],
      });
    const deletedDish = storedRestaurant.dishes.find((d) => d.id === dish.id);

    expect(deletedDish).toBeUndefined();
    expect(storedRestaurant.dishes.length).toBe(dishesList.length - 1);
  });

  it('deleteDishFromRestaurant should throw exception for non-existent restaurant', async () => {
    const dish: DishEntity = dishesList[0];
    await expect(() =>
      service.deleteDishFromRestaurant('0', dish.id),
    ).rejects.toHaveProperty(
      'message',
      'El restaurante con el id suministrado no ha sido encontrado',
    );
  });

  it('deleteDishFromRestaurant should throw exception for non-existent dish', async () => {
    await expect(() =>
      service.deleteDishFromRestaurant(restaurant.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El plato con el id suministrado no ha sido encontrado',
    );
  });

  it('deleteDishFromRestaurant should throw exception for dish not associated to restaurant', async () => {
    const newDish: DishEntity = {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price({ min: 5, max: 100 })),
      dishCategory: DishCategory.DESSERT,
      restaurants: [],
    };
    await dishRepository.save(newDish);

    await expect(() =>
      service.deleteDishFromRestaurant(restaurant.id, newDish.id),
    ).rejects.toHaveProperty(
      'message',
      'El plato con el id suministrado no está asociado al restaurante',
    );
  });
});
