import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [UrlService],
  controllers: [UrlController],
})
export class UrlModule {}
