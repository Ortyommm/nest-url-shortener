import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Redirect,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { UrlService } from './url.service';
import { AddUrlDto } from './dto/add-url.dto';
import { IUrlQuery } from './types';
import { Throttle } from '@nestjs/throttler';
import 'dotenv/config';

// You can use site subdirectories for url shortener. For example, example.com/c/ instead of example.com
@Controller(process.env.HOST ? new URL(process.env.HOST).pathname : '/')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Get()
  showIndexPage(@Res() res: Response) {
    return this.urlService.showIndexPage(res);
  }

  @Get(':url')
  goToUrl(@Param() params, @Res() res) {
    return this.urlService.goToUrl(res, params.url);
  }

  @Throttle(10, 60)
  @Post()
  shortCode(
    @Body() dto: AddUrlDto,
    @Res() res: Response,
    @Query() query: IUrlQuery,
  ) {
    return this.urlService.shortCode(res, dto, query);
  }
}
