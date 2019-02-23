const request = require('supertest');
const express = require('express');
const jsonWebToken = require("jsonwebtoken");

const app = require("../../app");


test('GET /', (done) => {
  request(app)
    .get('/')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /text\/html/)
    .end((err, res) => {
      if (err) throw err;
      done();
    })
});

test('GET /cold-start', done => {
  // request(app)
  //   .get('/cold-start')
  //   .expect(200)
  //   .expect('Content-Type', /application\/json/)
  //   .expect({ message : "Server started. Backend can now receive requests." })
  //   .end(err => {
  //     if (err) throw err;
  //     done();
  //   })
  
  request(app)
    .get("/cold-start")
    .then((res) => {
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message : "Server started. Backend can now receive requests." });
      done();
    });
  
});


// check for a cookie










// create and send a cookie
  // send a request with: body.userId
  // check for res.body to equal
test('POST to /create-cookie', done => {
  // done is to notify superTest library to signal completion of the test
  
  request(app)
    .post('/create-cookie')
    .send({ userId : 100 })
    .then(res => {
      
      // this is NOT for setting. this is for MATCHING
      const signedToken = jsonWebToken.sign({
        data : {
          userId : 100
        }
      }, "red scuba steel sheet");
      
      // expect the test cookie to equal this signed cookie
      expect(res.cookies.jwtTestCookie).toEqual('jwtTestCookie', signedToken)
    })
});

// {
//   "route" : '/create-cookie',
//   "cookieName" : 'jwtTestCookie',
//   "jwToken/VALUE" : signedToken,
//   "expireDate" : expireDate
// }










