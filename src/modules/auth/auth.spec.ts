import { TestingModule, Test } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: Partial<UserService>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    userService = {
      createUser: jest.fn(),
      findByEmail: jest.fn(),
    };
    jwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should sign up a user', async () => {
      const mockedUser = {
        id: 1,
        fullName: 'john Doe',
        email: 'newUser@name.com',
        password: 'asdf1234',
      };
      (userService.createUser as jest.Mock).mockResolvedValue(mockedUser);

      const payload = {
        fullName: 'john Doe',
        email: 'newUser@name.com',
        password: 'asdf1234',
      };

      const result = await authService.register(payload);
      expect(result).toEqual(mockedUser);
    });
  });
});
