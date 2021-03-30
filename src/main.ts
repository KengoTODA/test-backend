import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as passport from 'passport';
import * as express from 'express';
import * as session from 'express-session';
import * as csurf from 'csurf';
import { AppModule } from './app.module';
import { existsSync, readFileSync } from 'fs';
import * as helmet from 'helmet';
import { HttpError } from 'http-errors';

const CERT_FILE = 'localhost.pem';
const KEY_FILE = 'localhost-key.pem';

async function bootstrap() {
  let httpsOptions = {};
  if (existsSync(`./${KEY_FILE}`) && existsSync(`./${CERT_FILE}`)) {
    httpsOptions = {
      key: readFileSync(`./${KEY_FILE}`),
      cert: readFileSync(`./${CERT_FILE}`),
    };
  } else if (process.env.NODE_ENV === 'development') {
    Logger.log(
      `Certificate files not found. Put ${KEY_FILE} and ${CERT_FILE} in the project root to use HTTPS.`,
    );
  }

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", 'https://github.com/'],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Wiredcraft Back-end Developer Test')
    .setDescription(
      'a RESTful API that can get/create/update/delete user data from a persistence database',
    )
    .setVersion('1.0')
    .addTag('users')
    .addOAuth2()
    .build();
  // TODO "try it out" in API page does not work due to CORS
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: httpsOptions.hasOwnProperty('key'),
      },
    }),
  );
  app.use((req: express.Request, res: express.Response, next: any) => {
    try {
      next();
    } catch (e) {
      console.log(typeof e, e);
      if (e instanceof HttpError) {
        res.status(e.status).send({
          statusCode: e.status,
          message: e.message,
        });
      } else {
        next(e);
      }
    }
  });
  app.use(csurf());
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(3000);
}
bootstrap();
