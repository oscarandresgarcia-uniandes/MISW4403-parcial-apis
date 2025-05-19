import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CuisineType } from './restaurant.entity/restaurant.entity';

export class RestaurantDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly address: string;

  @IsNotEmpty()
  @IsString()
  readonly page: string;

  @IsNotEmpty()
  @IsEnum(CuisineType)
  readonly cuisineType: CuisineType;
}
