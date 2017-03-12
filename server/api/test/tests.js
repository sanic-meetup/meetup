let mongoose = require("mongoose");
let user = require("../models/user");
let follower = require("../models/follower");
let following  = require("../models/following");
let vars = require("./testvars.js");
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app').app;
let should = chai.should();
const request = require('supertest');
var agent = request(server);

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

  describe('/POST signin', () => {
      before((done) => { //add user test
          new user(vars.testuser).save();
          done();
      });

      it('signing in with valid credentials should return 200 and give valid token', (done) => {
        agent.post('/signin/').type('json').send(vars.testuser)
        .end(function(err, res) {
          agent.get('/api/testauth?token='+res.body.token)
          .end(function(err, res) {
              res.should.have.status(200);
              done();
          });
        });
      });//end it

      it('signing in with bad credentials should return 401', (done) => {
        agent.post('/signin/').type('json').send(vars.testuser_badpw)
        .end(function(err, res){
          res.should.have.status(401);
          done();
        })
      });//end it
    }); //end desc

    //@TODO finish these tests
    describe('/GET following', () => {
        before((done) => { //add user test
            new user(vars.testuser).save();
            new following(vars.testfollowing_1).save();
            done();
        });

        it('getting followers for valid uesr with follower should work', (done) => {
          agent.post('/signin/').type('json').send(vars.testuser)
          .end(function(err, res){
            agent.get('/api/following/?token='+res.body.token)
            .end(function(err, res) {
              res.should.have.status(200);
              res.body.should.eql(["test2"]);
              done();
            });
          });
        });

    });//end desc

    //@TODO finish these tests
    describe('/POST follow', () => {
        before((done) => { //add user test
            new user(vars.testuser).save();
            done();
        });

    });//end desc

    //@TODO finish these tests
    describe('/GET followers', () => {
        before((done) => { //add user test
            new user(vars.testuser).save();
            done();
        });

    });//end desc
});//end outer (USER API TESTS)
