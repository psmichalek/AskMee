'use strict'

const request = require('supertest')
const exp = require('chai').expect

describe('Loading the Express server ', () => {

    var server, noDbConnError

    beforeEach( () => {
        delete require.cache[require.resolve('../index.js')]
        server = require('../index.js').server
        noDbConnError = require('../index.js').noDbConnError
    })

    afterEach( (done) => {
        server.close(done)
    })

    it('should respond to / ', (done) => {
        request(server)
        .get('/')
        .expect(200,done)
    })

    it('should respond to /keywords ', (done) => {
        request(server)
        .get('/keywords')
        .set('Accept','application/json')
        .expect(200, noDbConnError, done)
    })

    it('should respond to /ques/:id ', (done) => {
        request(server)
        .get('/ques/123')
        .set('Accept','application/json')
        .expect(200, noDbConnError, done)
    })

    it('should respond to post /ques/:id? ', (done) => {
        request(server)
        .post('/ques/123')
        .set('Accept','application/json')
        .expect(200, noDbConnError, done)
    })

    it('should respond to get /oauth2/nufiddle/auth ', (done) => {
        request(server)
        .get('/oauth2/nufiddle/auth')
        .set('Accept','application/json')
        .expect(302, done)
    })

    it('should respond to get /oauth2/nufiddle/callback ', (done) => {
        request(server)
        .get('/oauth2/nufiddle/callback')
        .set('Accept','application/json')
        .expect(200, done)
    })

    it('should respond to get /oauth2/nufaddle/auth ', (done) => {
        request(server)
        .get('/oauth2/nufiddle/auth')
        .set('Accept','application/json')
        .expect(302, done)
    })

    it('should respond to get /oauth2/nufaddle/callback ', (done) => {
        request(server)
        .get('/oauth2/nufiddle/callback')
        .set('Accept','application/json')
        .expect(200, done)
    })
})
