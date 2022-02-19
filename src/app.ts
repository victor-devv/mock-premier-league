import dotenv from 'dotenv';
const dotenvResult = dotenv.config();
if (dotenvResult.error) {
  throw dotenvResult.error;
}

import express, { Express, Request, Response } from 'express'

import http from 'http';

import cors from 'cors';
import compression from "compression";

import connectRedis from 'connect-redis';

//import session from 'express-session';
// const redisStore = connectRedis(session);
// import redis from 'redis';

const redis = require('redis')
const session = require('express-session')

let redisStore = require('connect-redis')(session)

import morgan from 'morgan';
import logger from './utils/logger'

import responseTime from 'response-time';
import cookieParser from 'cookie-parser';

import limiter from '../config/request-limit';

import { CommonRoutesConfig } from './routes/common.routes';
import { IndexRoutes } from './routes/index.routes';
import { TeamRoutes } from './routes/team.routes';
import { UserRoutes } from './routes/user.routes';
import { FixturesRoutes } from './routes/fixture.routes';
import { AuthRoutes } from './routes/auth.routes';

import errorHandler from './middlewares/error-handler.middleware';

const app: express.Application = express();
const server: http.Server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()) //configure for security on prod
app.use(compression())
app.use(limiter); //limit requests
app.use(morgan('dev'));
app.use(cookieParser());

const routes: Array<CommonRoutesConfig> = [];
routes.push(new IndexRoutes(app));
routes.push(new TeamRoutes(app));
routes.push(new UserRoutes(app));
routes.push(new FixturesRoutes(app));
routes.push(new AuthRoutes(app));

if (process.env.NODE_ENV !== 'test') {

  const redisClient = redis.createClient({ url: 'redis://redis:6379' })

  redisClient.connect()

  redisClient.on('connect', () => {
    logger.info('Redis client connected');
  });

  redisClient.on('error', (err: any) => {
    logger.info(err);
  });

  app.use(
    session({
      secret: 'secret',
      store: new redisStore({ client: redisClient }),
      resave: false,
      saveUninitialized: false
    })
  );
}

app.use(responseTime());

//handle 404
app.use((req: Request, res: Response) => {
  res.status(404).json(
    {
      "status" : "error",
      "data": {
        "message": "Resource Not Found"
      }
    }
  );
});
app.use(errorHandler);

const port = process.env.PORT || 8080

// if (process.env.NODE_ENV !== 'test') {
  
  export default server.listen(port, () => {
    logger.info(`App is running at http://localhost:${port}`)

    routes.forEach((route: CommonRoutesConfig) => {
      logger.info(`Routes configured for ${route.getName()}`);
    });
  });

// }

 server;
