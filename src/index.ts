import 'reflect-metadata';

import { Container } from 'typedi';
import { createConnection, useContainer as useContainerOrm } from 'typeorm';
import { useContainer } from 'routing-controllers';
import { Application } from './config/Application';
import { IDbConfig } from './interfaces/IDbConfig';
import { WinstonLoggerImpl } from './services/WinstonLoggerImpl';
import { MongoDbServiceImpl } from './services/MongoDbServiceImpl';

useContainer(Container);
useContainerOrm(Container);

const dbConfigService: IDbConfig = Container.get(MongoDbServiceImpl);
const logger = Container.get(WinstonLoggerImpl);

createConnection(dbConfigService.getDbConfig())
  .then(() => Container.get(Application).start())
  .catch((error) => logger.error('[ERROR]:', error));
