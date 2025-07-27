import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { createOrUpdateProfileDto } from './dto/createOrUpdateProfile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async updateOrCreateProfile(
    userId: string,
    createOrUpdateProfileDto: createOrUpdateProfileDto,
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });

    if (!user) {
      throw new NotFoundException('user tidak ditemukan');
    }

    if (user.profile) {
      // update profile
      Object.assign(user.profile, createOrUpdateProfileDto);
      await this.profileRepository.save(user.profile);
      return { message: 'Profile updated!' };
    } else {
      // tambah profile
      const newProfile = this.profileRepository.create(
        createOrUpdateProfileDto,
      );
      newProfile.user = user;

      await this.profileRepository.save(newProfile);
      return { message: 'Profile created!' };
    }
  }

  async getUserProfileByToken(userId: string): Promise<User | null> {
    const userProfile = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profile: {
          age: true,
          bio: true,
        },
      },
    });

    return userProfile;
  }
}
