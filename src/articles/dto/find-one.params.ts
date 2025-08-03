import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class FindOneParams {
  @ApiProperty({ description: 'Id Article' })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id: string;
}
