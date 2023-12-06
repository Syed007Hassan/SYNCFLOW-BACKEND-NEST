import { Inject, Injectable } from '@nestjs/common';
import { ExistingUserDto } from 'src/user/dto/existing-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { EmployerService } from 'src/employer/employer.service';
import { Role } from './model/role.enum';
import { ExistingEmployerDto } from 'src/employer/dto/existing-employer.dto';
import { LoginEmployerDto } from 'src/employer/dto/login-employer.dto';
import { HttpService } from '@nestjs/axios';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CompanyService } from 'src/company/company.service';
import { CreateCompanyDto } from 'src/company/dto/create-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Recruiter } from 'src/employer/entities/employer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Recruiter)
    private readonly employerRepo: Repository<Recruiter>,
    private userService: UserService,
    private employerService: EmployerService,
    private jwtService: JwtService,
    private companyService: CompanyService,
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async registerEmployer(user: ExistingEmployerDto) {
    const findUser = await this.employerService.findOneByEmail(user.email);
    if (findUser) {
      throw new Error('Recruiter already exists with this email');
    }

    let company = await this.companyService.findOneByName(user.companyName);

    if (company) {
      throw new Error('Company already exists with this name');
    }

    if (!company) {
      company = await this.companyService.create({
        companyName: user.companyName,
        companyEmail: '',
        companyAddress: '',
        companyPhone: 0,
        companyWebsite: '',
      });
    }

    const newUser = await this.employerService.create(
      {
        name: user.name,
        email: user.email,
        password: user.password,
        phone: user.phone,
        designation: user.designation,
        role: Role.Employer,
        companyId: company.id,
      },
      company,
    );

    return newUser;
  }

  async loginEmployer(loginUserDto: LoginEmployerDto) {
    const user = await this.validateEmployer(
      loginUserDto.email,
      loginUserDto.password,
      loginUserDto.role,
    );

    const payload = {
      email: user.email,
      name: user.name,
      companyId: user.companyId,
      role: user.role,
    };
    const jwt = await this.jwtService.signAsync(payload);
    return { jwt };
  }

  async validateEmployer(email: string, password: string, role: string) {
    const user = await this.employerService.findOneByEmail(email);
    if (!user) {
      throw new Error('User not found with this email');
    }
    const isPasswordMatching = await this.doesPasswordMatch(
      password,
      user.password,
    );
    if (!isPasswordMatching) {
      throw new Error('Invalid credentials');
    }

    const company = await this.companyService.findOne(user.companyId);

    if (!company) {
      throw new Error('Company not found for this recruiter');
    }

    return {
      name: user.name,
      email: user.email,
      companyId: user.company.companyId,
      role: user.role,
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

  async registerUser(user: ExistingUserDto) {
    const findUser = await this.userService.findOneByEmail(user.email);
    if (findUser) {
      throw new Error('User already exists');
    }
    const newUser = await this.userService.create(user);
    return { name: newUser.name, email: newUser.email, role: newUser.role };
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

  async verifyJwt(jwt: string) {
    const payloadReturn = await this.jwtService.verifyAsync(jwt);

    //Check if token is expired
    // if (payloadReturn.exp < Date.now()) {
    //   throw new Error('Token expired');
    // }

    return payloadReturn;
  }

  async getPokemon(id: number): Promise<string> {
    // check if data is in cache:
    const cachedData = await this.cacheService.get<{ name: string }>(
      id.toString(),
    );
    if (cachedData) {
      console.log(`Getting data from cache!`);
      return `${cachedData.name}`;
    }

    // if not, call API and set the cache:
    const { data } = await this.httpService.axiosRef.get(
      `https://pokeapi.co/api/v2/pokemon/${id}`,
    );
    await this.cacheService.set(id.toString(), data);
    return await `${data.name}`;
  }
}
