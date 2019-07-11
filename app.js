const createError = require('http-errors');
const express = require( 'express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const swagger = require('swagger-spec-express');
const packageJson = require('./package.json');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

const options = {
  title: packageJson.name,
  version: packageJson.version
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

swagger.initialise(app, options);

app.get('/swagger.json', function (err, res) {
  res.status(200).json(swagger.json());
}).describe({
  responses: {
    200: {
      description: "Returns the swagger.json document"
    }
  }
});

swagger.compile();

const port = 3001;

app.listen(port, appListening);

function appListening() {
  console.info(packageJson.name + ' is listening on port ' + port);
}

module.exports = app;
