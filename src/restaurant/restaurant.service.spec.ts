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
        cuisineType: CuisineType.ITALIAN.toString(),
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
  });

  it('create should return a new restaurant', async () => {
    const restaurant: RestaurantEntity = {
      id: faker.string.uuid(),
      name: faker.company.name(),
      address: faker.location.streetAddress(),
      page: faker.internet.url(),
      cuisineType: CuisineType.MEXICAN.toString(),
      dishes: [],
    };

    const newRestaurant: RestaurantEntity = await service.create(restaurant);
    expect(newRestaurant).not.toBeNull();
  });

  it('create should throw an exception for an invalid cuisine type', async () => {
    const restaurant: RestaurantEntity = {
      id: faker.string.uuid(),
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
    restaurant.cuisineType = CuisineType.COLOMBIAN.toString();

    const updatedRestaurant: RestaurantEntity = await service.update(
      restaurant.id,
      restaurant,
    );
    expect(updatedRestaurant).not.toBeNull();
    expect(updatedRestaurant.name).toEqual('New Restaurant Name');
  });

  it('delete should remove a restaurant', async () => {
    const restaurant: RestaurantEntity = restaurantsList[0];
    await service.delete(restaurant.id);

    const deletedRestaurant: RestaurantEntity = await repository.findOne({
      where: { id: restaurant.id },
    });
    expect(deletedRestaurant).toBeNull();
  });
});
