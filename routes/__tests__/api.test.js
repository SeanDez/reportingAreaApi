require('dotenv').config();
const request = require('supertest');
const express = require('express');
const jsonWebToken = require("jsonwebtoken");
const encryptor = require("simple-encryptor")(process.env.simpleEncryptorSecret);

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
          userId : encryptor.encrypt(100)
        }
      }, process.env.jwtSecret);
  
  
      const setCookieHeader = res.headers['set-cookie'][0]
        .split(';');
  
      const [cookieName, cookieValue] = setCookieHeader[0].split("=");
      
      const verifiedToken = jsonWebToken.verify(signedToken, process.env.jwtSecret);
      const decryptedToken = encryptor.decrypt(verifiedToken.data.userId);
      
      // expect the test cookie to equal this signed cookie
      expect(cookieName).toEqual('jwtTestCookie');
      expect(decryptedToken).toEqual(100);
      done();
    })
});

// {
//   "route" : '/create-cookie',
//   "cookieName" : 'jwtTestCookie',
//   "jwToken/VALUE" : signedToken,
//   "expireDate" : expireDate
// }










