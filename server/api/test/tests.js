let mongoose = require("mongoose");
let user = require("../models/user");
let vars = require("./testvars.js");
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app').app;
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('USER API Tests', () => {
  /*
  * Test making a user
  */
  describe('/POST user', () => {
      beforeEach((done) => { //Before each test we empty the database
          user.remove({username:"test"}, (err) => {
             done();
          });
      });

      it('registering a valid user', (done) => {
        chai.request(server)
            .post('/users/')
            .send(vars.testuser)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.eql(vars.testuser_resp);
              done();
            });
      });//end it

      it('registering a existing user should return 409', (done) => {
        //make the user
        new user(vars.testuser).save();
        chai.request(server)
            .post('/users/')
            .send(vars.testuser)
            .end((err, res) => {
                res.should.have.status(409);
              done();
            });
      });//end it

      it('registering a user with bad credentials should return 400', (done) => {
        //make the user
        chai.request(server)
            .post('/users/')
            .send(vars.emptyuser)
            .end((err, res) => {
                res.should.have.status(400);
              done();
            });
      });//end it
  });//end descr

});//end outer (USER API TESTS)
