import {
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  IsOptional,
} from 'class-validator';
import { Role } from '../enum/role.enum';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  @IsString({ message: 'Password harus berupa string' })
  @MinLength(8, { message: 'Password minimal 8 karakter' })
  @Matches(/[A-Z]/, {
    message: 'Password minimal harus memiliki 1 huruf kapital',
  })
  @Matches(/\d/, {
    message: 'Password minimal harus memiliki 1 angka',
  })
  @Matches(/[@$!%*?&]/, {
    message: 'Password minimal harus memiliki 1 simbol (@$!%*?&)',
  })
  password: string;

  @IsEnum(Role)
  @IsOptional()
  role: Role;
}
