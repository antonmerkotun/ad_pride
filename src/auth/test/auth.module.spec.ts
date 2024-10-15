import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../service/auth.service';
import { AuthController } from '../controller/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../../user/module';

describe('AuthModule', () => {
  let authService: AuthService;
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        UserModule,
        ConfigModule.forRoot(),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: { expiresIn: '300s' },
          }),
        }),
      ],
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authService = app.get<AuthService>(AuthService);
  });

  it('should sign a JWT token', async () => {
    const token = await authService.generateToken({
      id: 1,
      username: 'testuser',
    });

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });

  afterAll(async () => {
    await app.close();
  });
});
