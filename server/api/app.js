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
var stat = require('./utils/utils.js').statcodes;
var docstrip = require('./utils/utils.js').docstrip;
var str = require('./utils/utils.js').stringify;

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
var following = require("./models/following");

//for auth
app.set('superSecret', 'this is a supersecret secret key'); // secret variable

//for test suite
exports.app = app;

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


/**
* private method for checking passwd
*/
var checkPassword = function(user, password){
        var hash = crypto.createHmac('sha512', user.salt);
        hash.update(password);
        var value = hash.digest('base64');
        return (user.password === value);
};


/*
* Given a username and password signs into the app and returns a token if
* log in was valid. 400 if Unauthorized.
*/
app.post('/signin/', function (req, res, next) {
  //sanitize
  req.body.username = sanitizer.sanitize(req.body.username);
  req.body.password = sanitizer.sanitize(req.body.password);
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
    longitude: sanitizer.sanitize(req.body.longitude),
    latitude: sanitizer.sanitize(req.body.latitude),
    height: sanitizer.sanitize(req.body.height)
  };

  //sanitize & validate
  req.body.username = sanitizer.sanitize(req.body.username);
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
  req.body.username = sanitizer.sanitize(req.body.username);
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
  req.body.username = sanitizer.sanitize(req.body.username);
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
  req.query.username = sanitizer.sanitize(req.query.username);
  if (req.query.username) {
    u = req.query.username;
  }

  following.findOne({username: u}, function (err, doc) {
    if (err) return res.status(500).end(stat._500);
    if (doc) {
      // res.status(200).send({"following": doc.following});
      User.find ({username: {$in: doc.following}}, function (err, docs) {
        console.log(docs);
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
  req.query.username = sanitizer.sanitize(req.query.username);
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
  req.query.username = sanitizer.sanitize(req.query.username);
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
    availability: sanitizer.sanitize(req.body.availability),
    message: sanitizer.sanitize(req.body.message)
  };
  req.body.inform = sanitizer.sanitize(req.body.inform);

  User.findOneAndUpdate({username: req.decoded._doc.username}, {status: new_status}, {upsert: true}, function(err, data) {
    if (err) return res.status(500).end(stat._500);
    //for response
    if(req.body.inform){
      notifyFollowers(req.decoded._doc.username, 'status_update', data);
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
  req.body.username = sanitizer.sanitize(req.body.username);
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
  // console.log("here");
});

/**
* Helper Function to send notification to all following users.
*/
function notifyFollowers(username, nevent, data){
  follower.findOne({username: username}, function (err, doc) {
    if (err) return res.status(500).end(stat._500);
    //if user has followers notify them via push notification
    if (doc) {
      for (var i = 0; i < doc.followers.length; i ++) {
        pusher.trigger(doc.followers[i], nevent, data);
      }
    }
  });
}

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
