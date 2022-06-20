// import { AdminModuleFactory } from '@admin-bro/nestjs/types/interfaces/admin-module-factory.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import * as entities from './database/entities';

export const adminProvider = {
  imports: [AuthModule, ConfigModule],
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  useFactory: (authService: AuthService, configService: ConfigService) => ({
    adminBroOptions: {
      rootPath: '/admin',
      resources: Object.values(entities),
      branding: {
        companyName: 'Interchange.io',
      },
    },
    auth: {
      authenticate: async (email: string, password: string) => {
        try {
          const user = await authService.signIn({ email, password });
          if (user) {
            return user;
          }
        } catch {
          return false;
        }
      },
      // cookieName: configService.get('ADMIN.COOKIE_NAME'),
      // cookiePassword: configService.get('ADMIN.COOKIE_PASSWORD'),
    },
  }),
  inject: [ConfigService],
};
