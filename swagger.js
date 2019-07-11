const express = require('express');
const swagger = require('swagger-spec-express');
const _ = require ('lodash');
const SwaggerUi = require ('./swagger-ui');
const packageJson = require ('./package.json');

class Swagger {
  constructor(app) {
    this.app = app;
    swagger.initialize(this.app, {
      title: `${packageJson.name}`,
      info: {
        basePath: '/',
      },
      version: packageJson.version,
      consumes: ['application/json'],
      produces: ['application/json'],
    });
  }

  configure() {
    swagger.compile();
    // serve swagger
    // eslint-disable-next-line consistent-return
    this.app.use((req, res, next) => {
      if (req.path !== '/favicon.ico') return next();
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.statusCode = req.method === 'OPTIONS' ? 200 : 405;
        res.setHeader('Allow', 'GET, HEAD, OPTIONS');
        res.setHeader('Content-Length', '0');
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Length', '0');
        res.setHeader('Content-Type', 'image/x-icon');
      }
      res.end();
    });
    this.app.use('/api-docs', express.static(SwaggerUi.absolutePath()));
    this.app.get('/swagger.json', (req, res) => {
      const swaggerJson = swagger.json();
      swaggerJson.paths = _.mapValues(swaggerJson.paths, (swaggerPath) => {
        const swaggerMethod = swaggerPath[Object.keys(swaggerPath)[0]];
        swaggerPath[Object.keys(swaggerPath)[0]] = _.omit(swaggerMethod, 'addedParameters');
        return swaggerPath;
      });
      res.send(swaggerJson);
    });
  }
}

module.exports =  Swagger ;
