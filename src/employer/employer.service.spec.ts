import { Test, TestingModule } from '@nestjs/testing';
import { EmployerService } from './employer.service';
import { Repository } from 'typeorm';
import { Recruiter } from './entities/employer.entity';
import { CompanyService } from '../company/company.service';
import { HttpService } from '@nestjs/axios';
import { Cache } from 'cache-manager';
import { CreateEmployerDto } from './dto/create-employer.dto';
import { ExistingEmployerDto } from './dto/existing-employer.dto';
import { Company } from '../company/entities/company.entity';

describe('EmployerService', () => {
  let service: EmployerService;
  let employerRepo: Repository<Recruiter>;
  let companyService: CompanyService;
  let httpService: HttpService;
  let cacheService: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployerService,
        {
          provide: 'RecruiterRepository',
          useClass: Repository,
        },
        {
          provide: CompanyService,
          useValue: {
            findOneByName: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: Cache,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EmployerService>(EmployerService);
    employerRepo = module.get<Repository<Recruiter>>('RecruiterRepository');
    companyService = module.get<CompanyService>(CompanyService);
    httpService = module.get<HttpService>(HttpService);
    cacheService = module.get<Cache>(Cache);
  });

  describe('create', () => {
    it('should create a new employer', async () => {
      const createUserDto: CreateEmployerDto = {
        email: 'test@test.com',
        password: 'password',
        name: 'Test User',
        companyId: 1,
        phone: 123,
        designation: '',
        role: 'Employer',
      };

      const newCompany = new Company();
      newCompany.companyName = 'Test Company';
      newCompany.companyEmail = 'testcompany@test.com';
      newCompany.companyWebsite = 'www.testcompany.com';
      newCompany.companyAddress = '123 Test Street';

      const newUser = new Recruiter();
      newUser.company = newCompany;
      newUser.name = createUserDto.name;
      newUser.email = createUserDto.email;
      newUser.password = createUserDto.password;
      newUser.phone = createUserDto.phone;
      newUser.designation = createUserDto.designation;
      newUser.role = createUserDto.role;

      jest.spyOn(employerRepo, 'create').mockReturnValue(newUser);
      jest.spyOn(employerRepo, 'save').mockResolvedValue(newUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(newUser);
      expect(employerRepo.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: expect.any(String),
      });
      expect(employerRepo.save).toHaveBeenCalledWith(newUser);
    });
  });
});

// describe('findAll', () => {
//   it('should return all employers', async () => {
//     const employers = [
//       {
//         id: 1,
//         email: 'test1@test.com',
//         password: 'password1',
//         name: 'Test User 1',
//         companyId: 1,
//       },
//       {
//         id: 2,
//         email: 'test2@test.com',
//         password: 'password2',
//         name: 'Test User 2',
//         companyId: 2,
//       },
//     ];
//     jest.spyOn(cacheService, 'get').mockResolvedValue(null);
//     jest.spyOn(employerRepo, 'find').mockResolvedValue(employers);
//     jest.spyOn(cacheService, 'set').mockResolvedValue(null);

//     const result = await service.findAll();

//     expect(result).toEqual(employers);
//     expect(cacheService.get).toHaveBeenCalledWith('all_recruiters');
//     expect(employerRepo.find).toHaveBeenCalled();
//     expect(cacheService.set).toHaveBeenCalledWith(
//       'all_recruiters',
//       employers,
//     );
//   });
// });

// describe('findOneByEmail', () => {
//   it('should return an employer by email', async () => {
//     const email = 'test@test.com';
//     const user = {
//       id: 1,
//       email,
//       password: 'password',
//       name: 'Test User',
//       companyId: 1,
//     };
//     const cacheKey = `recruiter_email_${email}`;
//     jest.spyOn(cacheService, 'get').mockResolvedValue(null);
//     jest.spyOn(employerRepo, 'findOneBy').mockResolvedValue(user);
//     jest.spyOn(cacheService, 'set').mockResolvedValue(null);

//     const result = await service.findOneByEmail(email);

//     expect(result).toEqual(user);
//     expect(cacheService.get).toHaveBeenCalledWith(cacheKey);
//     expect(employerRepo.findOneBy).toHaveBeenCalledWith({ email });
//     expect(cacheService.set).toHaveBeenCalledWith(cacheKey, user);
//   });
// });

// describe('findOne', () => {
//   it('should return an employer by id', async () => {
//     const id = 1;
//     const user = {
//       id,
//       email: 'test@test.com',
//       password: 'password',
//       name: 'Test User',
//       companyId: 1,
//     };
//     const cacheKey = `recruiter_id_${id}`;
//     jest.spyOn(cacheService, 'get').mockResolvedValue(null);
//     jest.spyOn(employerRepo, 'findOneBy').mockResolvedValue(user);
//     jest.spyOn(cacheService, 'set').mockResolvedValue(null);

//     const result = await service.findOne(id);

//     expect(result).toEqual(user);
//     expect(cacheService.get).toHaveBeenCalledWith(cacheKey);
//     expect(employerRepo.findOneBy).toHaveBeenCalledWith({ id });
//     expect(cacheService.set).toHaveBeenCalledWith(cacheKey, user);
//   });
// });
