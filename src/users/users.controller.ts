import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/auth/entities/user.entity';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/decolators/roles.decolator';
import { Role } from 'src/auth/enum/role.enum';
import { FindOneParams } from './dto/find-one.params';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async findAll(): Promise<Omit<User, 'password' | 'article'>[]> {
    const users = await this.userService.findAllUser();
    const userList = users.map((user) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    });

    return userList;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('/:id')
  async update(
    @Param() params: FindOneParams,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<{ message: string }> {
    const userData = await this.findOneOrFail(params.id);

    const message = await this.userService.updateRoleUser(
      userData,
      updateRoleDto,
    );
    return message;
  }

  private async findOneOrFail(id: string): Promise<User> {
    const user = await this.userService.findByParams(id);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }
}
