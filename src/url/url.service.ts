import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { AddUrlDto } from './dto/add-url.dto';
import { Url } from './models/url.model';
import { UrlDataSource } from './url-data-source';
import createShortCode from './helpers/createShortCode';
import { addHttp, isUrl } from './helpers/urlHelpers';
import { IUrlQuery } from './types';
import { pagesRoot } from '../app.module';
import * as path from 'path';
import removeSlashes from '../helpers/removeSlashes';

const urlRepository = UrlDataSource.getRepository(Url);

@Injectable()
export class UrlService {
  async goToUrl(res: Response, url: string) {
    const existingUrl = await urlRepository.findOne({
      where: { shortCode: url },
    });
    if (!existingUrl) {
      // You can use site subdirectories for url shortener. For example, example.com/c/ instead of example.com
      // if (
      //   removeSlashes(url) === removeSlashes(new URL(process.env.HOST).pathname)
      // ) {
      //   return res.sendFile(path.join(pagesRoot, 'index.html'));
      // }
      // return res.sendFile(path.join(pagesRoot, '404.html'));
      throw new HttpException("Url doesn't exist!", 404);
    }
    existingUrl.visitCount++;
    UrlDataSource.manager.save(existingUrl);

    // if (existingUrl) {
    return res.redirect(existingUrl.longUrl);
    // }
    // throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  }

  async shortCode(res: Response, dto: AddUrlDto, query: IUrlQuery) {
    // If we want to make our API private
    if (process.env.SECRET_KEY && process.env.SECRET_KEY !== query.secret_key) {
      throw new HttpException('Incorrect secret key', HttpStatus.FORBIDDEN);
    }
    const longUrl = addHttp(dto.longUrl.trim());
    if (!isUrl(longUrl)) {
      throw new HttpException(
        'String is not a valid url',
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingUrl = await urlRepository.findOne({
      where: { longUrl },
    });

    if (existingUrl) {
      return res.status(200).json({
        ...existingUrl,
        shortUrl: process.env.HOST + existingUrl.shortCode,
      });
    }

    const shortCode = await createShortCode(async (code) => {
      const hasSameCode = !(await urlRepository.findOne({
        where: { shortCode: code },
      }));
      return hasSameCode;
    });
    const newUrl = urlRepository.create({
      shortCode,
      longUrl,
    });
    await UrlDataSource.manager.save(newUrl);
    return res
      .status(201)
      .json({ ...newUrl, shortUrl: process.env.HOST + shortCode });
  }

  // showIndexPage(res: Response) {
  //   return res.sendFile(path.join(pagesRoot, 'index.html'));
  // }
}
