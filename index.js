'use strict'

const ObjectId      = require('mongodb').ObjectId
const MongoClient   = require('mongodb').MongoClient
const express       = require('express')
const bodyParser    = require('body-parser')
const path          = require('path')
const shortid       = require('shortid')

const MONGO_PW      = (process.env.MICHALEK_APPLES_PW) ? process.env.MICHALEK_APPLES_PW : '12345'
const HOST_PORT     = (process.env.PORT) ? process.env.PORT : 3007
const DB_URL        = 'mongodb://rainbowdash:'+MONGO_PW+'@ds139969.mlab.com:39969/michalek-apples'
const COLLECTION    = 'askmee'
const VW_INDEX      = 'views/index.ejs'
const VW_ERROR      = 'views/error.ejs'

const app = express()
var server = app.listen(HOST_PORT, () => { console.log('listening on '+HOST_PORT) })
var db
var noDbConnError = {'success':false,'error':'no database connection established'}

MongoClient.connect(DB_URL, (err,database) => {
    if(err) return console.log('Error connecting to database. ',err)
    db = database
})

app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static(path.join(__dirname,'public')))

app.set('view engine','ejs')

app.get('/', (req,res) => {
    if(db){
        db.collection(COLLECTION).find().toArray( (err,result) => {
            if(err) return console.log(err)
            res.render(path.join(__dirname,VW_INDEX),{ques:result})
        })
    } else res.render(path.join(__dirname,VW_ERROR),{err:noDbConnError.error})
})

app.get('/list',(req,res) => {
    if(db){
        db.collection(COLLECTION).find().toArray( (err,result) => {
            if(err) return console.log(err)
            res.json(result)
        })
    } else res.json(noDbConnError)
})

app.get('/ques/:id', (req,res) => {
    if(db){
        db.collection(COLLECTION)
        .findOne({uid:req.params.id},(err,result) => {
            if(err) return console.log(err)
            res.json(result)
        })
    } else res.json(noDbConnError)
})

app.post('/ques/:id?', (req,res) => {
    if(db){
        console.log('id = '+req.params.id)
        if(typeof req.params.id==='undefined'){
            let doc = {}
            doc.uid = shortid.generate()
            doc.question = (req.body.question) ? req.body.question : ''
            doc.answer = (req.body.answer) ? req.body.answer : ''
            doc.keywords = (req.body.keywords) ? req.body.keywords : ''
            console.log('new doc: ',doc)
            db.collection(COLLECTION)
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
            db.collection(COLLECTION)
            .findOneAndUpdate({uid:req.params.id},{$set:doc},{sort:{_id:-1},upsert:false},(err,result) => {
                if(err) return console.log(err)
                console.log('question updated ',result)
                //res.json(result)
                res.redirect('/')
            })
        }
    } else res.json(noDbConnError)
})

module.exports = {
    'server':server,
    'noDbConnError':noDbConnError
}
