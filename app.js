import express from 'express';
import logger from 'morgan';    
import headers from './middlewares/headers';
import indexRouter from './routes/index';
import cookieParser from 'cookie-parser';
import requestUri from './middlewares/requestUri';
import authorize from './middlewares/authorize';
import mongoose from 'mongoose'
import createError from 'http-errors';

// connect to mongodb
const dbURI =  `mongodb+srv://${process.env.MONGO_ATLAS_USER}:${process.env.MONGO_ATLAS_PW}@cluster0.uvkji.mongodb.net/${process.env.MONGO_ATLAS_DB_NAME}?retryWrites=true&w=majority`;

mongoose.connect(dbURI)
.then((result) => console.log('conected'))
.catch((err) => console.log(err))

const app = express();

app.use(headers);

app.use(logger('dev'));
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ extended: false, limit: '200mb' }));
app.use(cookieParser());

app.use(requestUri);
app.use(authorize);

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
  });

  // error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    status: 'error',
    message: err.errors ? Object.values(err.errors)[0] : err.message,
    errors: err.errors,
    stack: err.stack,
  });
});

export default app;