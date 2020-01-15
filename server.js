
const express = require('express');
const passport = require('passport');
const Strategy = require('passport-google-oauth20').Strategy;
 require('dotenv').config()
const {Users} = require('./models');

passport.use(new Strategy({
    clientID: process.env.google_id,
    clientSecret: process.env.google_secret,
    callbackURL: '/auth/google/callback'
  },
  (accessToken, refreshToken, profile, cb)=> {
         Users.findOne({where:{ googleId: profile.id }}).then((userexits)=>{
            if(userexits){
              cb(null,userexits)
            }else{  
            Users.create({
              googleID: profile.id,
              displayName:profile.displayName,
              emails:profile.emails[0].value
            }).then((user)=>{
              cb(null,user)
            }).catch((err)=>{
              console.log(err)
            })
           }
              }).catch((err)=>{
                console.log(err)
              })   
  }));  
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'Hello Worlds', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

    app.get('/',
      function(req, res) {
        res.render('home', { user: req.user });
      });

    app.get('/login',
      function(req, res){
        res.render('login');
      });

      app.get('/auth/google',passport.authenticate('google',{ scope: ['profile','email'] } )
      );

    app.get('/auth/google/callback', 
      passport.authenticate('google', { failureRedirect: '/login' }),
      function(req, res) {
        res.redirect('/');
      }
    );
    app.get('/profile', function(req, res, next) {
        Users.findAll({},(err,formdatas)=>{})
        .then((formdatas)=>{
        res.render('profile',{ formdatas:formdatas})
          }).catch((err)=>{
console.log(err)
        })
      });

app.listen(process.env['PORT'] || 8080);