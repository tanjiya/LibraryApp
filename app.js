const createError  = require('http-errors'),
  express      = require('express'),
  path         = require('path'),
  cookieParser = require('cookie-parser'),
  logger       = require('morgan'),
  mongoose     = require('mongoose');

/**
* Include Router
*/
const appRouter = require('./routes/index'),
  app = express();

/**
* View Engine Setup
*/
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
* Use Router
*/
app.use(appRouter);

/**
* Set Up Mongoose Connection
*/
const mongoDB = 'mongodb://localhost:27017/library';
// mongoose.connect(mongoDB, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

mongoose.Promise = global.Promise;
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true 
}, (err) => {
    if(!err) {
      console.log('MongoDB has connected successfully!');
    } else {
      console.log('The error: ' + err);
    }
});

/**
* Catch 404 and Forward to Error Handler
*/
app.use((req, res, next) => {
  res.render('./errors/404');
});

/**
* Error Handler
*/
app.use(function(err, req, res, next) {
  // Set Locals, Only Providing Error in Development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render The Error Page
  res.status(err.status || 500);
  res.render('./errors/500');
});

module.exports = app;

// SET DEBUG=library:* & npm run devstart
