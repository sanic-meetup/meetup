/*jshint esversion:6*/
/*jshint -W030*/
var crypto = require('crypto'),
  path = require('path'),
  express = require('express');
  app = express(),
  sanitize = require('sanitizer').sanitize,
  validator = require('express-validator'),
  jwt = require('jsonwebtoken'),
  conf = require('./conf'),
  fs = require('fs'),
  helper = require('sendgrid').mail,
  utils = require('./utils/utils.js'),
  stat = utils.statcodes,
  docstrip = utils.docstrip,
  str = utils.stringify,
  checkPassword = utils.checkPassword,
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  Pusher = require('pusher'),
  https = require('https');

//bodyparser conf
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//validator conf
app.use(validator([]));

//db conf
mongoose.connect(conf.mongouri, utils.mongo_options);

//models
var User = require("./models/user"),
  follower = require("./models/follower"),
  following = require("./models/following");

//for auth
app.set('superSecret', 'this is a supersecret secret key'); // secret variable

//for test suite
exports.app = app;

//for push notifications
var pusher = new Pusher(utils.pusher_conf);

//for strapdown library & other static files we may use later on
app.use("/static/", express.static(__dirname + '/static'));

app.get("/", utils.render_index);

//middleware to verify a token
var apiRoutes = express.Router();
apiRoutes.use(utils.tokenauth);

//apply apiroutes only to routes with prefix /api
app.use('/api', apiRoutes);

/**
* for creating a new user, see docs
*/
app.post("/users/", function (req, res, next) {
  //some basic validation
  req.body.username = sanitize(req.body.username);
  req.body.password = sanitize(req.body.password);
  req.body.email = sanitize(req.body.email);

  if (!req.body.username || !req.body.password || !req.body.email) return res.status(400).end(stat._400);

  var new_user = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  });

  new_user.save(function(err) {
    //if err user exists
    if (err) res.status(409).send(stat._409);
    else {
      res.status(200).send(str({username:req.body.username}));
    }
  });

});

/*
* Given a username and password signs into the app and returns a token if
* log in was valid. 400 if Unauthorized.
*/
app.post('/signin/', function (req, res, next) {
  //sanitize
  req.body.username = sanitize(req.body.username);
  req.body.password = sanitize(req.body.password);
  if (!req.body.username || ! req.body.password) return res.status(400).send(stat._400);

  var user = new User({
      username: req.body.username,
      password: req.body.password
    });

  User.find({username: user.username}, function(err, result){
    if (err) return res.status(500).end(stat._500);
    if (!result[0] || !checkPassword(result[0], user.password)) return res.status(401).end(stat._401);

    // successful auth,  create a token
    var t = 60*60*24;
    var token = jwt.sign(result[0], app.get('superSecret'), {
      expiresIn: t // expires in 24 hours (measured in seconds)
    });

    res.status(200).send(str({username: user.username, token: token, expiesIn: t}));
  });
});

/**
* test route only
*/
app.get("/api/testauth", function(req, res, next){
    res.status(200).send(str({success: true}));
});


/*
* Update the user's location
*/
app.put("/api/location/", function (req, res, next) {
  //create the object & sanitize
  var newloc = {
    longitude: sanitize(req.body.longitude),
    latitude: sanitize(req.body.latitude),
    height: sanitize(req.body.height)
  };

  //sanitize & validate
  req.body.username = sanitize(req.body.username);
  req.checkBody().notEmpty();

  //check permissions
  if (!req.decoded._doc.admin && req.decoded._doc.username !== req.body.username) {
    return res.status(401).end(stat._400);
  }
  //update and return the location info
  User.findOneAndUpdate({username: req.body.username}, {location: newloc}, {upsert: true}, function(err, data) {
    if (err) return res.status(500).end(stat._500);
    //for response
    follower.findOne({username: req.body.username}, function (err, doc) {
      if (err) return res.status(500).end(stat._500);
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
    res.status(200).send(str(data.location));
  });
});

/**
* Follow a user
*/
app.post("/api/follow/", function(req, res, next) {
  //standard sanitization
  req.body.username = sanitize(req.body.username);
  req.checkBody().notEmpty();

  follower.findOneAndUpdate({username: req.body.username}, {$addToSet: {followers: req.decoded._doc.username}}, {upsert: true}, function(err, doc) {
    if (err) return res.status(500).end(stat._500);
    //add to following list
    following.findOneAndUpdate({username: req.decoded._doc.username}, {$addToSet: {following: req.body.username}}, {upsert: true}, function(err, doc) {
      if (err) return res.status(500).end(stat._500);
      res.sendStatus(200);
    });
  });
});


/**
* Unfollow a user
*/
app.post("/api/unfollow/", function(req, res, next) {
  //standard sanitization
  req.body.username = sanitize(req.body.username);
  req.checkBody().notEmpty();

  follower.update({username: req.body.username}, {$pull: {followers: req.decoded._doc.username}}, {upsert: true}, function(err, doc) {
    if (err) return res.status(500).end(err);
    //add to following list
    following.update({username: req.decoded._doc.username}, {$pull: {following: req.body.username}}, {upsert: true}, function(err, doc) {
      if (err) return res.status(500).end(err);
      res.sendStatus(200);
    });
  });
});


/**
* Giving token/param of a user returns the status and
* location of everyone the user is following
*/
app.get("/api/following/", function (req, res, next) {
  // a function to get everyone you follow
  var u = req.decoded._doc.username;
  req.query.username = sanitize(req.query.username);
  if (req.query.username) {
    u = req.query.username;
  }

  following.findOne({username: u}, function (err, doc) {
    if (err) return res.status(500).end(stat._500);
    if (doc) {
      // res.status(200).send({"following": doc.following});
      User.find ({username: {$in: doc.following}}, function (err, docs) {
        res.status(200).send(docs);
      });
    } else { res.status(200).send(str({"following": []})); }
  });
});

/**
* Gets the list of a followers for a given user via token/params.
*/
app.get("/api/followers/", function(req, res, next) {
  var u = req.decoded._doc.username;
  req.query.username = sanitize(req.query.username);
  if (req.query.username) {
    u = req.query.username;
  }

  follower.findOne({username: u}, function (err, doc) {
    if (err) return res.status(500).end(stat._500);
    if (doc) {
      res.status(200).send(str({"followers": doc.followers}));
      // User.find ({username: {$in: doc.followers}}, function (err, docs) {
      //   res.status(200).send(docs);
      // });
    } else { res.status(200).send(str({"followers": []})); }
  });
});

/**
* Returns the requesting users' info or if query param username is set then that
*/
app.get("/api/user/", function(req, res, next) {
  var u = req.decoded._doc.username;
  req.query.username = sanitize(req.query.username);
  if (req.query.username) {
    u = req.query.username;
  }

  User.findOne({username: u}, function (err, doc) {
    res.status(200).send(docstrip(doc));
  });
});

/*
* Set your the status of the current user
*/
app.put("/api/status/", function(req, res, next){

  //sanitize & validate
  req.checkBody().notEmpty();
  var new_status = {
    availability: sanitize(req.body.availability),
    message: sanitize(req.body.message)
  };
  req.body.inform = sanitize(req.body.inform);

  User.findOneAndUpdate({username: req.decoded._doc.username}, {status: new_status}, {upsert: true}, function(err, data) {
    if (err) return res.status(500).end(stat._500);
    //for response
    if(req.body.inform){
      utils.notifyFollowers(req.decoded._doc.username, 'status_update', data);
    }
    res.status(200).send(str(data.status));
  });
});


/*
* Get current users status
*/
app.get("/api/status/", function(req, res, next){
  User.findOne({username: req.decoded._doc.username}, function(err, data) {
    if (err) return res.status(500).end(stat._500);
    //for response
    res.status(200).send(str(data.status));
  });
});


/*
* Deletes the current user
*/
app.delete("/api/user/", function(req, res, next){

  //sanitize & validate
  req.body.username = sanitize(req.body.username);
  req.checkBody().notEmpty();

  //check permissions
  if (!req.decoded._doc.admin && req.decoded._doc.username !== req.body.username) {
    return res.status(401).end(stat._401);
  }

  //Remove User and all their relations
  User.remove({username: req.body.username}, function(err, doc) {
    following.remove({username: req.body.username}, function(err, doc) {
      follower.remove({username: req.body.username}, function(err, doc){
        following.update({}, {$pull: {following: req.body.username}}, {}, function (err, docs){
          follower.update({}, {$pull: {followers: req.body.username}}, {},function(err,docs){
            res.sendStatus(200);
          });
        });
      });
    });
  });
});

//https setup
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
