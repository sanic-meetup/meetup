var request = require('supertest');
var server = require('../app').app;
var agent = request(server);

exports.testuser = {
  username: "test",
  password: "test",
  email: "test@test.com"
};

exports.testuser3 = {
  username: "test8039483294797394010243",
  password: "test8039483294797394010243",
  email: "test@test.com"
};

exports.daniel = {
  username: "daniel",
  password: "daniel",
  email: "sanic.ca"
};

exports.testuser_badpw = {
  username: "test",
  password: "tessadawet",
  email: "test@test.com"
};

exports.testuser_resp = {
  username: "test"
};

exports.emptyuser = {
  username: "",
  password: "",
  email: ""
};

exports.scriptuser = {
  username: "<script>sdawe</script>",
  password: "<sadawe>sasd>",
  email: "<html>waesae</script>"
};

exports.testfollowing_1 = {
  username: "test",
  followers: ["test2"]
};

exports.get_token = function(user_json, callback) {
  var user = {
    username: user_json.username,
    password: user_json.password
  };
  agent.post('/signin/').type('json').send(user)
  .end(function(err, res) {
    //since brandon made us return text..
    callback(res.body.token);
  });
};
