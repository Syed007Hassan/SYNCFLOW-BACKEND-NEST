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
  Req,
  Res,
  Inject,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExistingUserDto } from 'src/user/dto/existing-user.dto';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { JwtGuard } from './guards/jwt-auth.guard';
import { RoleGuard } from './guards/role-auth.guard';
import { Role } from './model/role.enum';
import { HasRoles } from './decorators/has-roles.decorator';
import { JwtDto } from './dto/jwt.dto';
import { ExistingEmployerDto } from 'src/employer/dto/existing-employer.dto';
import { LoginEmployerDto } from 'src/employer/dto/login-employer.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { AddCompanyEmployeeDto } from 'src/employer/dto/add-employee.company.dto';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async auth() {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    console.log(JSON.stringify(req.user) + 'req.user');
    //{"provider":"google","providerId":"108883059921859475304","email":"smhsyed61smh@gmail.com","name":"Syed Hassan","picture":"https://lh3.googleusercontent.com/a/ACg8ocL_5WDMrVHky4yKciuoOBUAOmVd34s1G_Z2Ckkm_hG9=s96-c"}
    const token = await this.authService.oAuthLogin(req.user);

    // return await req.user;
    return token;
  }

  @Post('registerRecruiter')
  async createEmployer(@Body() existingUserDto: ExistingEmployerDto) {
    try {
      const user = await this.authService.registerEmployer(existingUserDto);
      return { success: true, data: user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Post('loginRecruiter')
  @HttpCode(HttpStatus.OK)
  async loginEmployer(@Body() loginUserDto: LoginEmployerDto) {
    try {
      const user = await this.authService.loginEmployer(loginUserDto);
      return { success: true, data: user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Post('registerCompanyEmployee/:companyId')
  async createCompanyEmployee(
    @Body() existingUserDto: AddCompanyEmployeeDto,
    @Param('companyId') companyId: string,
  ) {
    try {
      const user = await this.authService.registerCompanyEmployee(
        existingUserDto,
        +companyId,
      );
      return { success: true, data: user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Post('registerApplicant')
  async create(@Body() existingUserDto: ExistingUserDto) {
    try {
      const user = await this.authService.registerUser(existingUserDto);
      return { success: true, data: user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Post('loginApplicant')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto) {
    try {
      const user = await this.authService.login(loginUserDto);
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

  //@HasRoles(Role.Employer) can be used if employer logged in generated its token
  @ApiBearerAuth()
  @HasRoles(Role.Employer)
  @UseGuards(JwtGuard, RoleGuard)
  @Get('validateToken')
  testRoute() {
    return { success: true };
  }

  @Get('/:id')
  async getPokemon(@Param('id') id: number) {
    try {
      const data = await this.authService.getPokemon(id);
      return { success: true, data: data };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }
}
