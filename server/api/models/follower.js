// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var follower_schema = new Schema({
  username: { type: String, required: true, unique: true },
  followers: {type: Array}
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// the schema is useless so far
// we need to create a model using it
var follower = mongoose.model('follower', follower_schema);

// make this available to our users in our Node applications
module.exports = follower;
