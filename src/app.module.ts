import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from './url/models/url.model';
import { ConfigModule } from '@nestjs/config';
import { UrlModule } from './url/url.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

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
