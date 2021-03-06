import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ItemsModule } from './items/items.module';
import { CategoriesModule } from './categories/categories.module';
import { ChatsModule } from './chats/chats.module';
import { TelegramModule } from './telegram/telegram.module';
import { EventsModule } from './events/events.module';
import AdminJS from 'adminjs';
import { AdminModule } from '@adminjs/nestjs';
// import { adminProvider } from './app.provider';
import { Database, Resource } from '@adminjs/typeorm';
import { User, Category, Event, Invite, Item } from './database/entities';

AdminJS.registerAdapter({ Database, Resource });

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env`],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const connection: TypeOrmModuleOptions = {
          type: 'postgres',
          entities: [User, Category, Event, Invite, Item],
          host: configService.get('DATABASE_HOST'),
          port: configService.get('DATABASE_PORT'),
          username: configService.get('DATABASE_USERNAME'),
          password: configService.get('DATABASE_PASSWORD'),
          database: configService.get('DATABASE_NAME'),
          autoLoadEntities: true,
          synchronize: true,
        };

        return connection;
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: true,
      driver: ApolloDriver,
    }),
    AuthModule,
    ItemsModule,
    CategoriesModule,
    ChatsModule,
    TelegramModule,
    EventsModule,
    AdminModule.createAdmin({
      adminJsOptions: {
        rootPath: '/admin',
        resources: [User, Category, Event, Invite, Item],
        branding: {
          companyName: 'Interchange.io',
        },
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
