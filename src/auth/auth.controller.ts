import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { ExistingUserDto } from 'src/user/dto/existing-user.dto';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { JwtGuard } from './guards/jwt-auth.guard';
import { RoleGuard } from './guards/role-auth.guard';
import { Role } from './model/role.enum';
import { HasRoles } from './decorators/has-roles.decorator';
import { JwtDto } from './dto/jwt.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async create(@Body() existingUserDto: ExistingUserDto) {
    try {
      const user = await this.authService.registerUser(existingUserDto);
      return { success: true, data: user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Post('registerEmployer')
  async createEmployer(@Body() existingUserDto: ExistingUserDto) {
    try {
      const user = await this.authService.registerEmployer(existingUserDto);
      return { success: true, data: user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto) {
    try {
      const user = await this.authService.login(loginUserDto);
      return { success: true, data: user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Post('loginEmployer')
  @HttpCode(HttpStatus.OK)
  async loginEmployer(@Body() loginUserDto: LoginUserDto) {
    try {
      const user = await this.authService.loginEmployer(loginUserDto);
      return { success: true, data: user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Post('verify-jwt')
  @HttpCode(HttpStatus.OK)
  async verifyJwt(@Body() payload: JwtDto) {
    try {
      const user = await this.authService.verifyJwt(payload.jwt);
      return { success: true, data: user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @HasRoles(Role.Employee)
  @UseGuards(JwtGuard, RoleGuard)
  @Get('validateToken')
  testRoute() {
    return { success: true };
  }
}
