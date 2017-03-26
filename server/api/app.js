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
mongoose.Promise = global.Promise;

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

app.get("/docs", utils.render_index);

app.get("/", function (req, res, next) {
  res.send("hi");
});

//middleware to verify a token
var apiRoutes = express.Router();
apiRoutes.use(utils.tokenauth);

//apply apiroutes only to routes with prefix /api
app.use('/api', apiRoutes);

/**
* For creating a new user, see docs
*/
app.post("/users/", function (req, res, next) {
  //some basic validation
  res.setHeader('Content-Type', 'application/json');
  req.body.username = sanitize(req.body.username);
  req.body.password = sanitize(req.body.password);
  req.body.email = sanitize(req.body.email);
  // Check if empty
  if (!req.body.username || !req.body.password || !req.body.email) return res.status(400).end(stat._400);

  var new_user = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  });

  //TODO findout why insert doesn't work
  //Create new User in DB
  new_user.save(function(err) {
    if (err) return res.status(409).send(stat._409);
    else {
      // Push user to Follower DB
      follower.findOneAndUpdate({username: req.body.username}, {followers: []}, {upsert: true}, function(err, data){
        if (err) return res.status(409).send(stat._409);
        else{
          // Push user to FOllowing DB
          following.findOneAndUpdate({username: req.body.username}, {following: []}, {upsert: true}, function(err, data){
            if (err)  return res.status(409).send(stat._409);
            else{
              // If all is successful return username
              return res.status(200).send(str({username:req.body.username}));
            }
          });
        }
      });
    }
  });

});

/*
* Given a username and password signs into the app and returns a token if
* log in was valid. 400 if Unauthorized.
*/
app.post('/signin/', function (req, res, next) {
  // Sanitize + Check if empty
  req.body.username = sanitize(req.body.username);
  req.body.password = sanitize(req.body.password);
  if (!req.body.username || ! req.body.password) return res.status(400).send(stat._400);

  var user = new User({
      username: req.body.username,
      password: req.body.password
    });
  //Check user existence
  User.find({username: user.username}, function(err, result){
    if (err) return res.status(500).end(stat._500);
    if (!result[0] || !checkPassword(result[0], user.password)) return res.status(401).end(stat._401);

    // successful auth,  create a token
    var t = 60*60*24;
    var token = jwt.sign(result[0], app.get('superSecret'), {
      expiresIn: t // expires in 24 hours (measured in seconds)
    });
    res.setHeader('Content-Type', 'application/json');
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
app.put("/api/users/location/", function (req, res, next) {
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
      if(!doc) return res.status(404).end(stat._404);
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
app.post("/api/users/follow/", function(req, res, next) {
  // Standard sanitization
  req.body.username = sanitize(req.body.username);
  req.checkBody().notEmpty();

  // Check user existence
  User.findOne({username: req.body.username}, {}, function (err, doc) {
    if (err) return res.status(500).end(stat._500);
    if(!doc) return res.status(404).end(stat._404);
    // Update Follower DB
    follower.findOneAndUpdate({username: req.body.username}, {$addToSet: {followers: req.decoded._doc.username}}, {upsert: true}, function(err, doc) {
      if (err) return res.status(500).end(stat._500);
      // Add to following list
      following.findOneAndUpdate({username: req.decoded._doc.username}, {$addToSet: {following: req.body.username}}, {upsert: true}, function(err, doc) {
        if (err) return res.status(500).end(stat._500);
        res.sendStatus(200);
      });
    });
  });
});


/**
* Unfollow a user
*/
app.post("/api/users/unfollow/", function(req, res, next) {
  //standard sanitization
  req.body.username = sanitize(req.body.username);
  req.checkBody().notEmpty();

  // Update the Follower DB
  follower.update({username: req.body.username}, {$pull: {followers: req.decoded._doc.username}}, {upsert: true}, function(err, doc) {
    if (err) return res.status(500).end(err);
    // Remove from the Following DB
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
  res.setHeader('Content-Type', 'application/json');
  // Sanitize and assign
  var u = req.decoded._doc.username;
  req.query.username = sanitize(req.query.username);
  if (req.query.username) {
    u = req.query.username;
  }

  // Finds users that current user (u) is following
  following.findOne({username: u}, function (err, doc) {
    if (err) return res.status(500).end(stat._500);
    // Check user existence
    if(!doc) return res.status(404).end(stat._404);
    if (doc) {
      // Find the statuses of the returned list of users
      User.find ({username: {$in: doc.following}}, function (err, docs) {
        //TODO Strip info
        res.status(200).send(docs);
      });
    } else res.status(200).send(str({"following": []}));
  });
});

/**
* Gets the list of a followers for a given user via token/params.
*/
app.get("/api/followers/", function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  // Sanitize and assign
  var u = req.decoded._doc.username;
  req.query.username = sanitize(req.query.username);
  if (req.query.username) {
    u = req.query.username;
  }

  // Finds users that follow the current user (u)
  follower.findOne({username: u}, function (err, doc) {
    if (err) return res.status(500).end(stat._500);
    // Check user existence
    if(!doc) return res.status(404).end(stat._404);
    if (doc) res.status(200).send(str({"followers": doc.followers}));
    else res.status(200).send(str({"followers": []}));
  });
});


/**
* Giving a user check if the current user follows them
* If user doesn't exist false is returned.
*/
app.get("/api/following/check/", function (req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  // Sanitize and check if empty
  req.query.username = sanitize(req.query.username);
  if(!req.query.username) return res.status(400).end(stat._400);

  // Find the list of users the current user is following
  following.findOne({username: req.decoded._doc.username},
                    {},
                    function (err, usr){
                      if (err) return res.status(500).end(stat._500);
                      if (!usr) usr = {following: []};
                      // Check is the given user exist inside the list of following users
                      var fdoc = {follows: usr.following.includes(req.query.username)};
                      return res.status(200).send(fdoc);
                    });
});



/**
* Returns the requesting users' info or if query param username is set then that
*/
app.get("/api/users/", function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  // Sanitize and assign
  var u = req.decoded._doc.username;
  req.query.username = sanitize(req.query.username);
  if (req.query.username) {
    u = req.query.username;
  }

  // Find the current or given user
  User.findOne({username: u}, {}, function (err, doc) {
    if (err) return res.status(500).end(stat._500);
    if(!doc) return res.status(404).end(stat._404);
    // Find the list of users the current user(u) is following
    following.findOne({username: req.decoded._doc.username},
                      {},
                      function (err, usr){
                        if (err) return res.status(500).end(stat._500);
                        if (!usr) usr = {following: []};
                        doc = JSON.parse(docstrip(doc));
                        var fdoc = {};
                        // Add a check if the current user is following u
                        Object.assign(fdoc, doc, {follows: usr.following.includes(doc.username)});
                        return res.status(200).send(fdoc);
                      });
  });
});


/**
* Returns a list of users that match the query
*/
app.get("/api/users/search/", function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  // Sanitize and check if empty
  req.query.username = sanitize(req.query.username);
  req.query.limit = parseInt(sanitize(req.query.limit));
  if(!req.query.limit || !req.query.username) return res.status(400).end(stat._400);

  // Find all users that match the query
  User.find({username: {$regex:req.query.username}},
            {username: 1, _id: 0},
            {limit: req.query.limit},
            function (err, doc) {
              if (err) return res.status(500).end(stat._500);
              if(!doc) return res.status(404).end(stat._404);
              // Find the list of users the current user is following
              following.findOne({username: req.decoded._doc.username},
                                {},
                                function (err, usr){
                                  if (err) return res.status(500).end(stat._500);
                                  if (!usr) usr = {following: []};
                                  // Loop through each user
                                  doc = doc.map(function(element) {
                                    // Add a check if the current user is following u
                                    return {username: element.username,
                                            follows: usr.following.includes(element.username)};
                                  });
                                  return res.status(200).send(doc);
                                });
            });
});

/*
* Set your the status of the current user
*/
app.put("/api/users/status/", function(req, res, next){
  res.setHeader('Content-Type', 'application/json');
  //sanitize & validate
  req.checkBody().notEmpty();
  var new_status = {
    availability: sanitize(req.body.availability),
    message: sanitize(req.body.message)
  };
  req.body.inform = sanitize(req.body.inform);

  // Check existence, message and inform are optional
  if(!req.body.availability || req.body.message || req.body.inform) {
    return res.status(400).end(stat._400);
  }

  //Find the current user and set new status
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
app.get("/api/users/status/", function(req, res, next){
  res.setHeader('Content-Type', 'application/json');
  //Find the current user and get new status
  User.findOne({username: req.decoded._doc.username}, function(err, data) {
    if (err) return res.status(500).end(stat._500);
    // No need to check for existence as user logged in
    //for response
    res.status(200).send(str(data.status));
  });
});


/*
* Deletes the current user
*/
app.delete("/api/users/", function(req, res, next){
  res.setHeader('Content-Type', 'application/json');
  //sanitize & validate
  req.body.username = sanitize(req.body.username);
  req.checkBody().notEmpty();

  //check permissions
  if (!req.decoded._doc.admin && req.decoded._doc.username !== req.body.username) {
    return res.status(401).end(stat._401);
  }

  //Remove User and all their relations
  User.findOne({username: req.body.username}, function(err, data) {
    if (err) return res.status(500).end(stat._500);
    if (!data) return res.status(404).end(stat._404);
    // If user exist remove from all DB's
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
