//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// let mongoose = require("mongoose");
// let Book = require('../app/models/book');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let base58 = require('../server/base58.js');
let server = require('../app');
let mongoose = require("mongoose");
var Url = require('../server/models/url');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Routes', () => {
    /**
    * Test the /post short route
    */
    describe('/POST short create', () => {
        it('it should create/retrieve correct shortened url', (done) => {
            let data = {longUrl:"http://www.google.com"};
            chai.request(server)
            .post('/api/short')
            .send(data)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('shortUrl');
                done();
            });
        });
    });
    /**
    * Test the /GET redirect route
    */
    describe('/GET/:encoded_id url redirect', () => {
        it('it should redirect to correct website', (done) => {
            let encoded_id = '2';
            var id = base58.decode(encoded_id);
            Url.findOne({_id: id}, (err, doc) => {
                chai.request(server)
                .get('/api/'+encoded_id)
                .redirects(0)
                .end((err, res) => {
                    res.should.have.status(301);
                    res.should.redirectTo(doc.long_url);
                    // res.request.url.should.be.equal(doc.long_url);
                    done();
                });
            });
        });
    });
});