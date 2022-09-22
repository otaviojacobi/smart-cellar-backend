import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { Express } from 'express';

import { Server } from 'http';
import { Context } from 'aws-lambda';
import { createServer, proxy, Response } from 'aws-serverless-express';
import * as express from 'express';
import helmet from 'helmet';
import { EntityNotFoundExceptionFilter } from './filters/entity-not-found-exception.filter';

//global['fetch'] = require('node-fetch');

async function createApp(expressApp: Express): Promise<INestApplication> {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new EntityNotFoundExceptionFilter());
  app.use(helmet());
  return app;
}

let cachedServer: Server;

async function bootstrap(): Promise<Server> {
  const expressApp = express();
  const app = await createApp(expressApp);
  await app.init();
  return createServer(expressApp);
}

export async function handler(event: any, context: Context): Promise<Response> {
  if (!cachedServer) {
    const server = await bootstrap();
    cachedServer = server;
  }
  return proxy(cachedServer, event, context, 'PROMISE').promise;
}

if (process.env.NODE_ENV === 'local') {
  bootstrap().then((app) => app.listen(3000));
}
