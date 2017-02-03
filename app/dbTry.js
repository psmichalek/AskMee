'use strict'

const dburl = 'mongodb://rainbowdash:'+process.env.MICHALEK-APPLES-PW+'@ds161008.mlab.com:61008/michalek-apples'
const ObjectId = require('mongodb').ObjectId
const MongoClient = require('mongodb').MongoClient
const _ = require('lodash')
const collectionName = 'askmee'
var db

let qq = MongoClient.connect(dburl, (err,database) => {
    if(err) return console.log(err)
    database.collection(collectionName).findOne(ObjectId('588be20dec6f837de425986f'),function(err,res){
        if(err) console.log(err)
        console.log(res)
    })
})
