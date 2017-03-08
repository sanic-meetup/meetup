// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var fr_requestSchema = new Schema({
  user1: { type: String, required: true, unique: true },
  user2: { type: String, required: true, unique: true },
  link: String,
  created_at: Date,
  updated_at: Date
});

// the schema is useless so far
// we need to create a model using it
var fr_request = mongoose.model('fr_request', fr_requestSchema);

// make this available to our users in our Node applications
module.exports = fr_request;
