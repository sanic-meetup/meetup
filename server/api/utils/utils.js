//reqs
var follower = require("../models/follower"),
  helper = require('sendgrid').mail,
  fs = require('fs'),
  crypto = require('crypto'),
  pusher = require('pusher');

exports.statcodes = {
  _400: JSON.stringify({response:"bad request"}),
  _401: JSON.stringify({response:"unauthorized"}),
  _404: JSON.stringify({response: "not found"}),
  _409: JSON.stringify({response:"new user not created"}),
  _500: JSON.stringify({response:"server error"})
};

//strips the user objec returned by db to somthing not containing
//sensitive data
exports.docstrip = function(doc) {
  var new_doc = {
    username: doc.username,
    email: doc.email,
    status: doc.status,
    location: doc.location
  };
  return new_doc;
};

exports.stringify = function(obj) {
  return JSON.stringify(obj);
};

exports.pusher_conf = {
  appId: '311795',
  key: 'c44a3af2941478d93548',
  secret: '31d232d42bd6b466088b',
  encrypted: true
};

/**
* Helper Function to send notification to all following users.
*/
// exports.notifyFollowers = function (username, nevent, data){
//   follower.findOne({username: username}, function (err, doc) {
//     if (err) return res.status(500).end(stat._500);
//     //if user has followers notify them via push notification
//     if (doc) {
//       for (var i = 0; i < doc.followers.length; i ++) {
//         pusher.trigger(doc.followers[i], nevent, data);
//       }
//     }
//   });
// };

/**
* a helper function that sends email (from support@sanic.ca)
* data = message content, dest_email = recipient, sub = message subject
*/
exports.sendmail = function (data, dest_email, subj){
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
};

/**
* renders the docs
*/
exports.render_index = function(req, res, next) {
  var mode = "dev";
  fs.readFile('../README.md', 'utf8', function (err,data) {
    if (err) {
      return res.send("could not load api docs");
    }
    if (!process.env.NODE_ENV) {
      var v = "<!DOCTYPE html> <html><title>API Documentation</title><xmp theme=\"united\" style=\"display:none;\">";
      v += data;
      v += "</xmp><script src=\"/static/strapdown.js\"></script></html>";
        return res.send(v);
      } else return res.send("Docs are not available in production.");
    });
};

exports.tokenauth = function (req, res, next) {
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
};

/**
* private method for checking passwd
*/
exports.checkPassword = function(user, password){
        var hash = crypto.createHmac('sha512', user.salt);
        hash.update(password);
        var value = hash.digest('base64');
        return (user.password === value);
};

//recommended options from mlab
exports.mongo_options = {
  server: {
    socketOptions:
    {
      keepAlive: 300000,
      connectTimeoutMS: 30000
    }
  },
    replset: {
      socketOptions:
      {
        keepAlive: 300000,
        connectTimeoutMS : 30000
      }
    }
  };

var maps_apikey = "AIzaSyBGb5QiisgCg5wzHMPEAX2eDz5saOyo0BM";

exports.map_lookup = "https://maps.googleapis.com/maps/api/geocode/json?key=" + maps_apikey + "&latlng=";
