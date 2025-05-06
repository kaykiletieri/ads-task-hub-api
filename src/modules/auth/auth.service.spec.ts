import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: Partial<UserService>;
  let jwtService: Partial<JwtService>;

  beforeAll(() => {
    jest.spyOn(Logger.prototype, 'debug').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  beforeEach(() => {
    userService = {
      findByEmail: jest.fn(),
      verifyPassword: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(),
    };

    authService = new AuthService(userService, jwtService as JwtService);
  });

  describe('validateUser', () => {
    it('deve retornar os dados do usuário sem a senha quando a validação for bem-sucedida', async () => {
      const user = {
        id: 1,
        email: 'teste@exemplo.com',
        name: 'Usuário Teste',
        password: 'senhaCriptografada',
      };

      (userService.findByEmail as jest.Mock).mockResolvedValue(user);
      (userService.verifyPassword as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateUser(
        'teste@exemplo.com',
        'senha',
      );

      expect(result).toEqual({
        id: 1,
        email: 'teste@exemplo.com',
        name: 'Usuário Teste',
      });
      expect(userService.findByEmail).toHaveBeenCalledWith('teste@exemplo.com');
      expect(userService.verifyPassword).toHaveBeenCalledWith(
        'senha',
        'senhaCriptografada',
      );
    });

    it('deve retornar null quando o usuário não for encontrado', async () => {
      (userService.findByEmail as jest.Mock).mockResolvedValue(null);

      const result = await authService.validateUser(
        'inexistente@exemplo.com',
        'senha',
      );
      expect(result).toBeNull();
    });

    it('deve retornar null quando a senha for inválida', async () => {
      const user = {
        id: 1,
        email: 'teste@exemplo.com',
        name: 'Usuário Teste',
        password: 'senhaCriptografada',
      };

      (userService.findByEmail as jest.Mock).mockResolvedValue(user);
      (userService.verifyPassword as jest.Mock).mockResolvedValue(false);

      const result = await authService.validateUser(
        'teste@exemplo.com',
        'senhaIncorreta',
      );
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('deve retornar um token JWT quando o usuário existir', async () => {
      const authDto = {
        email: 'teste@exemplo.com',
        password: 'senha',
      };

      const user = {
        id: 1,
        email: 'teste@exemplo.com',
        name: 'Usuário Teste',
        password: 'senhaCriptografada',
      };

      (userService.findByEmail as jest.Mock).mockResolvedValue(user);
      (jwtService.sign as jest.Mock).mockReturnValue('token-jwt');

      const result = await authService.login(authDto);
      expect(result).toEqual({ access_token: 'token-jwt' });
      expect(userService.findByEmail).toHaveBeenCalledWith(authDto.email);
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: 'Usuário Teste',
        sub: 1,
      });
    });

    it('deve lançar um erro se o usuário não for encontrado', async () => {
      const authDto = {
        email: 'naoexiste@exemplo.com',
        password: 'senha',
      };

      (userService.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(authService.login(authDto)).rejects.toThrow(
        'User not found',
      );
    });
  });
});
