'use strict'

const MONGO_PW = (process.env.MICHALEK_APPLES_PW) ? process.env.MICHALEK_APPLES_PW : '12345'
const HOST_PORT = (process.env.PORT) ? process.env.PORT : 3007
const dburl = 'mongodb://rainbowdash:'+MONGO_PW+'@ds139969.mlab.com:39969/michalek-apples'
const ObjectId = require('mongodb').ObjectId
const MongoClient = require('mongodb').MongoClient
const express = require('express')
const bodyParser= require('body-parser')
const path = require('path')
const shortid = require('shortid')
const app = express()
const collectionName = 'askmee'
const vw_index = 'index.ejs'
var db

MongoClient.connect(dburl, (err,database) => {
    if(err) return console.log(err,MONGO_PW)
    db = database
    app.listen(HOST_PORT, () => {
      console.log('listening on '+HOST_PORT)
    })
})

app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static(path.join(__dirname,'public')))

app.set('view engine','ejs')

app.get('/', (req,res) => {
    db.collection(collectionName).find().toArray( (err,result) => {
        if(err) return console.log(err)
        res.render(path.join(__dirname,vw_index),{ques:result,dirr:__dirname})
    })
})

app.get('/list',(req,res) => {
    db.collection(collectionName).find().toArray( (err,result) => {
        if(err) return console.log(err)
        res.json(result)
    })
})

app.get('/ques/:id', (req,res) => {
    db.collection(collectionName)
    .findOne({uid:req.params.id},(err,result) => {
        if(err) return console.log(err)
        res.json(result)
    })
})

app.post('/ques/:id?', (req,res) => {
    console.log('id = '+req.params.id)
    if(typeof req.params.id==='undefined'){
        let doc = {}
        doc.uid = shortid.generate()
        doc.question = (req.body.question) ? req.body.question : ''
        doc.answer = (req.body.answer) ? req.body.answer : ''
        doc.keywords = (req.body.keywords) ? req.body.keywords : ''
        console.log('new doc: ',doc)
        db.collection(collectionName)
        .insert(doc, (err,result) => {
            if(err) return console.log(err)
            console.log('question saved ',result)
            res.redirect('/')
        })
    } else{
        let doc = {}
        if(req.body.question) doc.question = req.body.question
        if(req.body.answer) doc.answer = req.body.answer
        if(req.body.keywords) doc.keywords= req.body.keywords
        console.log('update object ',doc)
        db.collection(collectionName)
        .findOneAndUpdate({uid:req.params.id},{$set:doc},{sort:{_id:-1},upsert:false},(err,result) => {
            if(err) return console.log(err)
            console.log('question updated ',result)
            //res.json(result)
            res.redirect('/')
        })
    }
})
