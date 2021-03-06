'use strict'

const MONGO_UN      = (process.env.MICHALEK_APPLES_UN) ? process.env.MICHALEK_APPLES_UN : 'joejoe'
const MONGO_PW      = (process.env.MICHALEK_APPLES_PW) ? process.env.MICHALEK_APPLES_PW : '12345'
const HOST_PORT     = (process.env.PORT) ? process.env.PORT : 3007
const DB_URL        = 'mongodb://'+MONGO_UN+':'+MONGO_PW+'@ds139969.mlab.com:39969/michalek-apples'
const MongoClient = require('mongodb').MongoClient
const expect = require('chai').expect
const collectionName = 'askmee'
var db

describe('Check the connection to the db',() => {

        it('should connect to the db', (done) => {
            MongoClient.connect(DB_URL, (err,database) => {
                if(err) return console.log(err)
                expect(database).to.exist
                db = database
                done()
            })
        })

        it('should have a collection', (done) => {
            db.collection(collectionName).find().toArray( (err,result) => {
                if(err) return console.log(err)
                expect(result).to.exist
                done()
            })
        })

})
