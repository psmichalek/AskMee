'use strict'

const dburl = 'mongodb://joejoe:joe1234@ds161008.mlab.com:61008/askmee'
const ObjectId = require('mongodb').ObjectId
const MongoClient = require('mongodb').MongoClient
const express = require('express')
const bodyParser= require('body-parser')
const app = express()
const collQues = 'questions'

var db

MongoClient.connect(dburl, (err,database) => {
    if(err) return console.log(err)
    db = database
    app.listen(3000, () => {
      console.log('listening on 3000')
    })
})

app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static('public'))

app.set('view engine','ejs')

app.get('/', (req,res) => {
    db.collection(collQues).find().toArray( (err,result) => {
        if(err) return console.log(err)
        res.render(__dirname+'/views/index.ejs',{ques:result})
    })
})

app.get('/ques/:id', (req,res) => {
    db.collection(collQues)
    .findOne(ObjectId(req.params.id),(err,result) => {
        if(err) return console.log(err)
        res.json(result)
    })
})

app.post('/ques/:id?', (req,res) => {
    if(!req.params.id){
        db.collection(collQues)
        .save(req.body, (err,result) => {
            if(err) return console.log(err)
            console.log('question saved')
            res.redirect('/')
        })
    } else{
        db.collection(collQues)
        .findOneAndUpdate(ObjectId(req.params.id),req.body, (err,result) => {
            if(err) return console.log(err)
            console.log('question updated')
            res.redirect('/')
        })
    }
})
