import { DataSource } from 'typeorm';
import { Url } from './models/url.model';

const UrlDataSource = new DataSource({
  type: 'sqlite',
  database: 'urldb.sql',
  entities: [Url],
});

UrlDataSource.initialize();

export { UrlDataSource };
