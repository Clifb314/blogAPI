var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')
require('dotenv').config()

//mongoose
const mongoose = require('mongoose');
const { ExtractJwt } = require('passport-jwt');
//connection setup
const mongoDB = process.env.MONGODB
mongoose.connect(mongoDB, {useUnifiedTopology: true, useNewUrlParser: true})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'mongo connection error'))


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

//passport stuff
const passport = require('passport')
const localStrat = require('passport-local').Strategy
const JWTStrat = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt
const User = require('./models/userModel')
const bcrypt = require('bcryptjs')

passport.use(new localStrat(async (username, password, done) => {
  const myUser = await User.findOne({username}).exec()
  if (!myUser) return done(null, false, 'Username not found')
    

  bcrypt.compare(password, myUser._password, (err, res) => {
      if (res) return done(null, myUser)
      else return done(null, false, {message: 'Password incorrect'})
    })
  })
)



const options = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET,
  issuer: 'CB',
}
passport.use(new JWTStrat(options, function(payload, done) {
  return done(null, payload)
  // User.findById(payload.sub, function(err, user) {
  //   if (err) return done(err, false)
  //   if (user) return done(null, user)
  //   else return done(null, false)
  //})
}))

//middleware to get token from header
app.use(function(req, res, next) {
  const bearHead = req.headers.authorization
  if (bearHead) {
    const bear = bearHead.split(' ')
    req.token = bear[1]
  }
  next()
})



//routes
const usersRouter = require('./routes/users')
const postsRouter = require('./routes/posts')
const commentsRouter = require('./routes/comments')

app.use('/api/posts', postsRouter);
app.use('/api/comments', commentsRouter)
app.use('/api/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server started on port ${process.env.PORT || 5000}`);
});

module.exports = app;
