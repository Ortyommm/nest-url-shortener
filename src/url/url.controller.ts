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

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Redirect()
  @Get(':url')
  goToUrl(@Param() params) {
    return this.urlService.goToUrl(params.url);
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
