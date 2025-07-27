import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { ProfileService } from './profile.service';
import { createOrUpdateProfileDto } from './dto/createOrUpdateProfile.dto';
import { User } from 'src/auth/entities/user.entity';

@Controller('profile')
@UseGuards(AuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  async createOrUpdateProfile(
    @Request() req,
    @Body() createOrUpdateProfileDto: createOrUpdateProfileDto,
  ): Promise<{ message: string }> {
    const result = await this.profileService.updateOrCreateProfile(
      req.user.id,
      createOrUpdateProfileDto,
    );
    return result;
  }
  @Get()
  async getUserProfile(@Request() req): Promise<User | null> {
    return this.profileService.getUserProfileByToken(req.user.id);
  }
}
