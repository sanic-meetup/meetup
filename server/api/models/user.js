// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require("crypto");

// create a schema
var userSchema = new Schema({
  name: String,
  status:{
    availability: { type: String, enum: ["Available", "Busy", "Not Available"]},
    message: { type: String}
  },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  salt: { type: String },
  admin: Boolean,
  location: {
    longitude : Number,
    latitude: Number,
    height: Number
  },
  email: {type: String, required: true},
  meta: {
    age: Number,
    website: String
  },
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

userSchema.pre('save', function(next) {
  var salt = crypto.randomBytes(16).toString('base64');
  var hash = crypto.createHmac('sha512', salt);
  hash.update(this.password);
  this.salt = salt;
  this.password = hash.digest('base64');
  this.admin = false;
  this.status = {
    availability: 'Not Available',
    message: "I didn't set a message therfore #trump2020"
  };
  this.location = undefined;
  next();
});

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;
