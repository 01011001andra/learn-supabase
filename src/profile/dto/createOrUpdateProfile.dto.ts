import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class createOrUpdateProfileDto {
  @IsNotEmpty()
  @IsNumber()
  age: number;

  @IsNotEmpty()
  @IsString()
  bio: string;
}
