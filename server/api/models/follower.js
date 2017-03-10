// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var follower_schema = new Schema({
  username: { type: String, required: true, unique: true },
  followers: {type: Object},
  created_at: Date,
  updated_at: Date
});

// the schema is useless so far
// we need to create a model using it
var follower = mongoose.model('follower', follower_schema);

// make this available to our users in our Node applications
module.exports = follower;
