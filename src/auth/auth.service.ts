import { Injectable } from '@nestjs/common';
import { ExistingUserDto } from 'src/user/dto/existing-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { EmployerService } from 'src/employer/employer.service';
import { Role } from './model/role.enum';
import { ExistingEmployerDto } from 'src/employer/dto/existing-employer.dto';
import { LoginEmployerDto } from 'src/employer/dto/login-employer.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private employerService: EmployerService,
    private jwtService: JwtService,
  ) {}

  async registerUser(user: ExistingUserDto) {
    const findUser = await this.userService.findOneByEmail(user.email);
    if (findUser) {
      throw new Error('User already exists');
    }
    const newUser = await this.userService.create(user);
    return { name: newUser.name, email: newUser.email, role: newUser.role };
  }

  async registerEmployer(user: ExistingEmployerDto) {
    const findUser = await this.employerService.findOneByEmail(user.email);
    if (findUser) {
      throw new Error('User already exists');
    }
    const newUser = await this.employerService.create(user);
    return {
      name: newUser.name,
      email: newUser.email,
      companyName: newUser.companyName,
      phone: newUser.phone,
      role: newUser.role,
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(
      loginUserDto.email,
      loginUserDto.password,
      loginUserDto.role,
    );

    const payload = { email: user.email, name: user.name, role: user.role };
    const jwt = await this.jwtService.signAsync(payload);
    return { jwt };
  }

  async loginEmployer(loginUserDto: LoginEmployerDto) {
    const user = await this.validateEmployer(
      loginUserDto.email,
      loginUserDto.password,
      loginUserDto.companyName,
      loginUserDto.role,
    );

    const payload = { email: user.email, name: user.name, role: user.role };
    const jwt = await this.jwtService.signAsync(payload);
    return { jwt };
  }

  async doesPasswordMatch(password: string, hashedPassword: string) {
    return bcrypt.compareSync(password, hashedPassword); // true
  }

  async validateUser(email: string, password: string, role: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    const isPasswordMatching = await this.doesPasswordMatch(
      password,
      user.password,
    );
    if (!isPasswordMatching) {
      throw new Error('Invalid credentials');
    }
    return { name: user.name, email: user.email, role: user.role };
  }

  async validateEmployer(
    email: string,
    password: string,
    companyName: string,
    role: string,
  ) {
    const user = await this.employerService.findOneByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    const isPasswordMatching = await this.doesPasswordMatch(
      password,
      user.password,
    );
    if (!isPasswordMatching) {
      throw new Error('Invalid credentials');
    }

    const company = await this.employerService.findOneByCompanyName(
      companyName.toLowerCase(),
    );
    if (!company) {
      throw new Error('Company not found');
    }
    if (company.email !== email) {
      throw new Error('Email does not belong to the company');
    }

    return {
      name: user.name,
      email: user.email,
      companyName: companyName,
      role: user.role,
    };
  }

  async verifyJwt(jwt: string) {
    const payloadReturn = await this.jwtService.verifyAsync(jwt);

    //Check if token is expired
    // if (payloadReturn.exp < Date.now()) {
    //   throw new Error('Token expired');
    // }

    return payloadReturn;
  }
}
