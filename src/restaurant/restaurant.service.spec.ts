import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import {
  RestaurantEntity,
  CuisineType,
} from './restaurant.entity/restaurant.entity';
import { RestaurantService } from './restaurant.service';
import { faker } from '@faker-js/faker';
import { BusinessLogicException } from '../shared/errors/business-errors';

describe('RestaurantService', () => {
  let service: RestaurantService;
  let repository: Repository<RestaurantEntity>;
  let restaurantsList: RestaurantEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RestaurantService],
    }).compile();

    service = module.get<RestaurantService>(RestaurantService);
    repository = module.get<Repository<RestaurantEntity>>(
      getRepositoryToken(RestaurantEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    restaurantsList = [];
    for (let i = 0; i < 5; i++) {
      const restaurant: RestaurantEntity = {
        id: faker.string.uuid(),
        name: faker.company.name(),
        address: faker.location.streetAddress(),
        page: faker.internet.url(),
        cuisineType: CuisineType.ITALIAN,
        dishes: [],
      };
      restaurantsList.push(restaurant);
      await repository.save(restaurant);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all restaurants', async () => {
    const restaurants: RestaurantEntity[] = await service.findAll();
    expect(restaurants).not.toBeNull();
    expect(restaurants).toHaveLength(restaurantsList.length);
  });

  it('findOne should return a restaurant by id', async () => {
    const storedRestaurant: RestaurantEntity = restaurantsList[0];
    const restaurant: RestaurantEntity = await service.findOne(
      storedRestaurant.id,
    );
    expect(restaurant).not.toBeNull();
    expect(restaurant.id).toEqual(storedRestaurant.id);
    expect(restaurant.name).toEqual(storedRestaurant.name);
    expect(restaurant.address).toEqual(storedRestaurant.address);
    expect(restaurant.page).toEqual(storedRestaurant.page);
    expect(restaurant.cuisineType).toEqual(storedRestaurant.cuisineType);
  });

  it('findOne should throw an exception for an invalid restaurant', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'El restaurante con el id suministrado no fue encontrado',
    );
  });

  it('create should return a new restaurant', async () => {
    const restaurant: RestaurantEntity = {
      id: '',
      name: faker.company.name(),
      address: faker.location.streetAddress(),
      page: faker.internet.url(),
      cuisineType: CuisineType.MEXICAN,
      dishes: [],
    };

    const newRestaurant: RestaurantEntity = await service.create(restaurant);
    expect(newRestaurant).not.toBeNull();

    const storedRestaurant: RestaurantEntity = await repository.findOne({
      where: { id: newRestaurant.id },
    });
    expect(storedRestaurant).not.toBeNull();
    expect(storedRestaurant.name).toEqual(newRestaurant.name);
    expect(storedRestaurant.address).toEqual(newRestaurant.address);
    expect(storedRestaurant.page).toEqual(newRestaurant.page);
    expect(storedRestaurant.cuisineType).toEqual(newRestaurant.cuisineType);
  });

  it('create should throw an exception for an invalid cuisine type', async () => {
    const restaurant: RestaurantEntity = {
      id: '',
      name: faker.company.name(),
      address: faker.location.streetAddress(),
      page: faker.internet.url(),
      cuisineType: 'INVALID' as CuisineType,
      dishes: [],
    };

    await expect(() => service.create(restaurant)).rejects.toHaveProperty(
      'message',
      'El tipo de cocina debe ser: Italian, Colombian, Mexican, Japanese, Indian o International',
    );
  });

  it('update should modify a restaurant', async () => {
    const restaurant: RestaurantEntity = restaurantsList[0];
    restaurant.name = 'New Restaurant Name';
    restaurant.cuisineType = CuisineType.COLOMBIAN;

    const updatedRestaurant: RestaurantEntity = await service.update(
      restaurant.id,
      restaurant,
    );
    expect(updatedRestaurant).not.toBeNull();

    const storedRestaurant: RestaurantEntity = await repository.findOne({
      where: { id: restaurant.id },
    });
    expect(storedRestaurant).not.toBeNull();
    expect(storedRestaurant.name).toEqual(restaurant.name);
    expect(storedRestaurant.cuisineType).toEqual(restaurant.cuisineType);
  });

  it('update should throw an exception for an invalid restaurant', async () => {
    let restaurant: RestaurantEntity = restaurantsList[0];
    restaurant = {
      ...restaurant,
      name: 'New Restaurant Name',
    };
    await expect(() => service.update('0', restaurant)).rejects.toHaveProperty(
      'message',
      'El restaurante con el id suministrado no fue encontrado',
    );
  });

  it('update should throw an exception for an invalid cuisine type', async () => {
    const restaurant: RestaurantEntity = restaurantsList[0];
    restaurant.cuisineType = 'INVALID' as CuisineType;

    await expect(() =>
      service.update(restaurant.id, restaurant),
    ).rejects.toHaveProperty(
      'message',
      'El tipo de cocina debe ser: Italian, Colombian, Mexican, Japanese, Indian o International',
    );
  });

  it('delete should remove a restaurant', async () => {
    const restaurant: RestaurantEntity = restaurantsList[0];
    await service.delete(restaurant.id);

    const deletedRestaurant: RestaurantEntity = await repository.findOne({
      where: { id: restaurant.id },
    });
    expect(deletedRestaurant).toBeNull();
  });

  it('delete should throw an exception for an invalid restaurant', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'El restaurante con el id suministrado no fue encontrado',
    );
  });
});
