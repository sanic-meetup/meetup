// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var following_schema = new Schema({
  username: { type: String, required: true, unique: true },
  following: {type: Array},
  created_at: Date,
  updated_at: Date
});

// the schema is useless so far
// we need to create a model using it
var following = mongoose.model('following', following_schema);

// make this available to our users in our Node applications
module.exports = following;
