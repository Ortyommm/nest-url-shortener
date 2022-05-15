import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from './url/models/url.model';
import { ConfigModule } from '@nestjs/config';
import { UrlModule } from './url/url.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'urldb.sql',
      synchronize: true,
      entities: [Url],
    }),
    // Rate limit
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 20,
    }),
    UrlModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
export const pagesRoot = path.join(__dirname, '..', 'pages');
// You can use site subdirectories for url shortener. For example, example.com/c/ instead of example.com
export const rootPath = new URL(process.env.HOST).pathname;
