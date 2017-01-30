'use strict'

const dburl = 'mongodb://joejoe:joe1234@ds161008.mlab.com:61008/askmee'
const ObjectId = require('mongodb').ObjectId
const MongoClient = require('mongodb').MongoClient
const _ = require('lodash')

var db

let qq = MongoClient.connect(dburl, (err,database) => {
    if(err) return console.log(err)
    database.collection('questions').findOne(ObjectId('588be20dec6f837de425986f'),function(err,res){
        if(err) console.log(err)
        console.log(res)
    })
})

//qq.pipe(process.stdout)
