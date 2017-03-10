/*jshint esversion:6*/
var crypto = require('crypto');
var path = require('path');
var express = require('express');
var app = express();
var sanitizer = require('sanitizer');
var validator = require('express-validator');
var jwt = require('jsonwebtoken');
var conf = require('./conf');
var fs = require('fs');
var helper = require('sendgrid').mail;

//body parser stuff
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//validator
app.use(validator([]));

//db
var mongoose = require('mongoose');
mongoose.connect(conf.mongouri);

//models
var User = require("./models/user");
var follower = require("./models/follower");

//for auth
app.set('superSecret', 'this is a supersecret secret key'); // secret variable

//for push notifications
var Pusher = require('pusher');

var pusher = new Pusher({
  appId: '311795',
  key: 'c44a3af2941478d93548',
  secret: '31d232d42bd6b466088b',
  encrypted: true
});

app.get("/", function(req, res, next) {
  var mode = "dev";
  fs.readFile('../README.md', 'utf8', function (err,data) {
    if (err) {
      return res.send("could not load api docs");
    }
    if (mode === "dev") {
      var v = "<!DOCTYPE html> <html><title>API Documentation</title><xmp theme=\"united\" style=\"display:none;\">";
      v += data;
      v += "</xmp><script src=\"https://strapdownjs.com/v/0.2/strapdown.js\"></script></html>";
        return res.send(v);
      } else return res.send("It Works!");
    });
});

//middleware to verify a token
var apiRoutes = express.Router();
apiRoutes.use(function (req, res, next) {
  //this function is from the scoth.io tut - see the credits.md
  // check header or url parameters or post parameters for token
   var token = req.body.token || req.query.token || req.headers['x-access-token'];

   // decode token
   if (token) {
     // verifies secret and checks exp
     jwt.verify(token, app.get('superSecret'), function(err, decoded) {
       if (err) {
         return res.json({ success: false, message: 'Failed to authenticate token.' });
       } else {
         // if everything is good, save to request for use in other routes
         req.decoded = decoded;
         next();
       }
     });

   } else {
     // if there is no token
     // return an error
     return res.status(403).send({
         success: false,
         message: 'No token provided.'
     });
   }
});

//apply apiroutes only to routes with prefix /api
app.use('/api', apiRoutes);

/**
* for creating a new user, see docs
*/
app.post("/users/", function (req, res, next) {
  //some basic validation
  req.body.username = sanitizer.sanitize(req.body.username);
  req.body.password = sanitizer.sanitize(req.body.password);
  req.body.email = sanitizer.sanitize(req.body.email);
  req.checkBody('username', 'username field cannot be empty').notEmpty();
  req.checkBody('password', 'password field cannot be empty').notEmpty();
  req.checkBody('email', 'email field cannot be empty').notEmpty();

  var new_user = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  });

  new_user.save(function(err) {
    //if err user exists
    if (err) res.status(409).send('new user not created');
    else {
      res.status(200).send({username:req.body.username});
    }
  });

});

/**
* private method for checking passwd
*/
var checkPassword = function(user, password){
        var hash = crypto.createHmac('sha512', user.salt);
        hash.update(password);
        var value = hash.digest('base64');
        return (user.password === value);
};

app.post('/signin/', function (req, res, next) {
  //sanitize
  req.body.username = sanitizer.sanitize(req.body.username);
  req.body.password = sanitizer.sanitize(req.body.password);
  if (!req.body.username || ! req.body.password) return res.status(400).send("Bad Request");

  var user = new User({
      username: req.body.username,
      password: req.body.password
    });

  User.find({username: user.username}, function(err, result){
    if (err) return res.status(500).end(err);
    if (!result[0] || !checkPassword(result[0], user.password)) return res.status(401).end("Unauthorized");

    // successful auth,  create a token
    var t = 60*60*24;
    var token = jwt.sign(result[0], app.get('superSecret'), {
      expiresIn: t // expires in 24 hours (measured in seconds)
    });

    res.status(200).send({username: user.username, token: token, expiesIn: t});
  });
});

/**
* test route only
*/
app.get("/api/testauth", function(req, res, next){
    res.status(200).send({success: true});
});

//update the user's location
app.put("/api/location/", function (req, res, next) {
  //create the object & sanitize
  var newloc = {
    longitude: sanitizer.sanitize(req.body.longitude),
    latitude: sanitizer.sanitize(req.body.latitude),
    height: sanitizer.sanitize(req.body.height)
  };

  //sanitize & validate
  req.body.username = sanitizer.sanitize(req.body.username);
  req.checkBody().notEmpty();

  //check permissions
  if (!req.decoded._doc.admin && req.decoded._doc.username !== req.body.username) {
    return res.status(401).end("Unauthorized");
  }
  //update and return the location info
  User.findOneAndUpdate({username: req.body.username}, {location: newloc}, {upsert: true}, function(err, data) {
    if (err) return res.status(500).end(err);
    //for response
    follower.findOne({username: req.body.username}, function (err, doc) {
      if (err) return res.status(500).end(err);
      //if user has followers notify them via push notification
      if (doc) {
        for (var i = 0; i < doc.followers.length; i ++) {
          pusher.trigger(doc.followers[i], 'location-update', {
            username: req.body.username,
            location: data.location
          });
        }
      }
    });
    res.status(200).send(data.location);
  });
});

/**
* follow a user
*/
app.post("/api/follow/", function(req, res, next) {
  //standard sanitization
  req.body.username = sanitizer.sanitize(req.body.username);
  req.checkBody().notEmpty();

  follower.findOneAndUpdate({username: req.body.username}, {$addToSet: {followers: req.decoded._doc.username}}, {upsert: true}, function(err, doc) {
    if (err) return res.status(500).end(err);
    res.sendStatus(200);
  });
});

/**
* if query username is set then gets everyone username follows else everyone requesting
* user follows + their status
*/
app.get("/api/follow", function (req, res, next) {
  // a function to get everyone you follow
  var u = req.decoded._doc.username;
  req.query.username = sanitizer.sanitize(req.query.username);
  if (req.query.username) {
    u = req.query.username;
  }

});

/**
* gets the followers for requesting user or if query param username is set then
* that user
*/
app.get("/api/followers/", function(req, res, next) {
  var u = req.decoded._doc.username;
  req.query.username = sanitizer.sanitize(req.query.username);
  if (req.query.username) {
    u = req.query.username;
  }

  follower.findOne({username: u}, function (err, doc) {
    if (err) return res.status(500).end(err);
    if (doc) {
      res.status(200).send({"followers": doc.followers});
    } else { res.status(200).send({"followers": []}); }
  });
});

/**
* returns the requesting users' info or if query param username is set then that
* @TODO add some sanitization && validation
*/
app.get("/api/user/", function(req, res, next) {
  var u = req.decoded._doc.username;
  req.query.username = sanitizer.sanitize(req.query.username);
  if (req.query.username) {
    u = req.query.username;
  }

  User.findOne({username: u}, function (err, doc) {
    res.status(200).send(doc);
  });
});

/*
* Set your the status of the current user
*/
app.put("/api/status/", function(req, res, next){
  res.status(200).send(doc);
});

/**
* a helper function that sends email (from support@sanic.ca)
* data = message content, dest_email = recipient, sub = message subject
*/
function sendmail(data, dest_email, subj){
  //email setup, move to config file later
  from_email = new helper.Email("support@sanic.ca");
  to_email = new helper.Email(dest_email);
  subject = subj;
  content = new helper.Content("text/plain", data);
  mail = new helper.Mail(from_email, subject, to_email, content);
  var sg = require('sendgrid')('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');
  var request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  });
  sg.API(request, function(error, response) {
    if (error) console.log(error);
  });
}

//https setup
var https = require("https");
var fs = require('fs');
var privateKey = fs.readFileSync( 'certs/server.key' );
var certificate = fs.readFileSync( 'certs/server.crt' );
var config = {
        key: privateKey,
        cert: certificate
};

//https server
https.createServer(config, app).listen(3000, function () {
    console.log('HTTPS on port 3000');
});

//for dev only
var http = require("http");
http.createServer(app).listen(5000, function() {
  console.log("http on 5000");
});
