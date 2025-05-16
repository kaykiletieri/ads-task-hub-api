import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  beforeAll(() => {
    jest.spyOn(Logger.prototype, 'debug').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  beforeEach(() => {
    usersService = {
      findByEmail: jest.fn(),
      verifyPassword: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(),
    };

    authService = new AuthService(usersService, jwtService as JwtService);
  });

  describe('validateUser', () => {
    it('should return user data when the user is found and password is valid', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
      };

      (usersService.findByEmail as jest.Mock).mockResolvedValue(user);
      (usersService.verifyPassword as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateUser(
        'test@example.com',
        'password',
      );

      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
      });
      expect(usersService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(usersService.verifyPassword).toHaveBeenCalledWith(
        'password',
        'hashedPassword',
      );
    });

    it('should return null when the user is not found', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);

      const result = await authService.validateUser(
        'notfound@example.com',
        'password',
      );
      expect(result).toBeNull();
    });

    it('should return null when the password is invalid', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
      };

      (usersService.findByEmail as jest.Mock).mockResolvedValue(user);
      (usersService.verifyPassword as jest.Mock).mockResolvedValue(false);

      const result = await authService.validateUser(
        'test@example.com',
        'wrongPassword',
      );
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return a JWT token when the user is found', async () => {
      const authDto = {
        email: 'test@example.com',
        password: 'password',
      };

      const user = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: 'test@example.com',
      };

      (usersService.findByEmail as jest.Mock).mockResolvedValue(user);
      (jwtService.sign as jest.Mock).mockReturnValue('token-jwt');

      const result = await authService.login(authDto);
      expect(result).toEqual({ access_token: 'token-jwt' });
      expect(usersService.findByEmail).toHaveBeenCalledWith(authDto.email);
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: 'Test User',
        sub: 1,
      });
    });

    it('should throw an error when the user is not found', async () => {
      const authDto = {
        email: 'notfound@example.com',
        password: 'password',
      };

      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(authService.login(authDto)).rejects.toThrow(
        'User not found',
      );
    });
  });
});
