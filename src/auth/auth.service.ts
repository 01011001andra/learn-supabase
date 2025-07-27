import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { Role } from './enum/role.enum';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    const hashPassword = await bcrypt.hash(registerDto.password, 10);
    const userEmail = await this.userRepository.findOneBy({
      email: registerDto.email,
    });
    if (userEmail) {
      throw new ConflictException('Email is already exist');
    }
    const userData = await this.userRepository.find();
    const userRole: Role = userData.length === 0 ? Role.ADMIN : Role.USER;

    await this.userRepository.save({
      ...registerDto,
      password: hashPassword,
      role: userRole,
    });
    return { message: 'Register success!' };
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPassValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPassValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = await this.jwtService.signAsync({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { access_token: payload };
  }

  async getUser(id: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id: id });

    if (user?.password) {
      user.password = 'hidden';
    }

    return user;
  }
}
