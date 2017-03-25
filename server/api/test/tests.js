/*jshint esversion:6*/
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
  describe('/POST users', () => {
      before((done) => { //Before each test we empty the database
          user.remove({username:"test"}, (err) => {
             done();
          });
      });

      it('registering a valid user', (done) => {
        agent.post('/users/').type('json').send(vars.testuser)
            .end(function(err, res) {
                res.should.have.status(200);
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
        });
      });//end it
    }); //end desc

    //@TODO finish these tests
    describe('/GET /api/following', () => {
        before((done) => { //add user test
            vars.get_token(vars.testuser,
            function(token) {
              global.testuser_token = token;
              vars.get_token(vars.daniel, function(token) {
                global.daniel_token = token;
                done();
              });
            });
        });

        it('checking all of test\'s followers w/ token should work', (done) => {
          agent.get('/api/following/?token='+global.testuser_token)
          .type('json')
          .send(vars.testuser)
          .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a('array');
            done();
          });
        });

        it('checking who a user follows using a daniel\'s token'+
         'should work', (done) => {
          agent.get('/api/following/?token='+global.daniel_token)
          .type('json')
          .send(vars.testuser)
          .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a('array');
            done();
          });
        });

        it('checking who another user follows using username query ' +
         'should work', (done) => {
          agent.get('/api/following/?username=test&token='+global.daniel_token)
          .type('json')
          .send(vars.testuser)
          .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a('array');
            done();
          });
        });

    });//end desc

    //@TODO finish these tests
    describe('/POST /api/users/follow', () => {
        before((done) => { //add user test
            new user(vars.testuser3).save();
            vars.get_token(vars.testuser3,
            function(token) {
              global.testuser3_token = token;
              vars.get_token(vars.daniel, function(token) {
                global.daniel_token = token;
                done();
              });
            });
        });

        after((done) => {
          //remove testuser3
          agent.delete('/api/users/?token='+global.testuser3_token)
          .type('json').end(function(err, res){
            done();
          });
        });

        it('following a valid user should work', (done) => {
          agent.post('/api/follow/?token='+global.daniel_token)
          .type('json')
          .send({username: vars.testuser3.username})
          .end(function(err, res){
            //check followers match up
            agent.get('/api/followers/?token='+global.testuser3_token)
            .type('json')
            .end(function(err, res){
              res.should.have.status(200);
              res.body.followers.should.be.a('array');
              res.body.followers.should.eql(['daniel']);
              done();
            });
          });
        });

    });//end desc

    //@TODO finish these tests
    describe('/GET /api/followers', () => {
      before((done) => { //add user test
          vars.get_token(vars.testuser,
          function(token) {
            global.testuser_token = token;
            vars.get_token(vars.daniel, function(token) {
              global.daniel_token = token;
              done();
            });
          });
      });

      it('getting all a valid users followers should work', (done) => {
        agent.get('/api/followers/?token='+global.testuser_token)
        .type('json')
        .send(vars.testuser)
        .end(function(err, res){
          res.should.have.status(200);
          res.body.followers.should.be.a('array');
          done();
        });
      });

      it('getting all of daniel\'s followers with token method '+
       'should work', (done) => {
        agent.get('/api/followers/?token='+global.daniel_token)
        .type('json')
        .send(vars.testuser)
        .end(function(err, res){
          res.should.have.status(200);
          res.body.followers.should.be.a('array');
          done();
        });
      });

      it('getting another users\' folowers using username query ' +
       'should work', (done) => {
        agent.get('/api/followers/?username=test&token='+global.daniel_token)
        .type('json')
        .send(vars.testuser)
        .end(function(err, res){
          res.should.have.status(200);
          res.body.followers.should.be.a('array');
          done();
        });
      });
    });//end desc
});//end outer (USER API TESTS)
