'use strict'

const ObjectId      = require('mongodb').ObjectId
const MongoClient   = require('mongodb').MongoClient
const express       = require('express')
const bodyParser    = require('body-parser')
const path          = require('path')
const shortid       = require('shortid')
const MONGO_UN      = (process.env.MICHALEK_APPLES_UN) ? process.env.MICHALEK_APPLES_UN : 'joejoe'
const MONGO_PW      = (process.env.MICHALEK_APPLES_PW) ? process.env.MICHALEK_APPLES_PW : '12345'
const HOST_PORT     = (process.env.PORT) ? process.env.PORT : 3007
const DB_URL        = 'mongodb://'+MONGO_UN+':'+MONGO_PW+'@ds139969.mlab.com:39969/michalek-apples'
const COLLECTION    = 'askmee'
const VW_INDEX      = 'views/index.ejs'
const VW_ERROR      = 'views/error.ejs'

const app = express()
var server = app.listen(HOST_PORT, () => { console.log('listening on '+HOST_PORT) })
var io = require('socket.io')(server)
var db
var noDbConnError = {'success':false,'error':'no database connection established'}

io.on('connect',(socket) => {
    socket.on('message', () => {

    })
})

function _getKeywords(result){
    let keywords = []
    let kws = result.map( (val) => { return val.keywords } )
    if(kws.length>0){
        let tmp = []
        kws.forEach( (kv) => {
            let words = kv.split(',')
            words.map( (w) => { tmp.push(w) } )
        })
        keywords = tmp.filter( (val,pos) => { return tmp.indexOf(val.trim())==pos })
    }
    return keywords
}

function _getResponseDataObject(result,query){
    let rows = (result) ? Array.from(result) : []
    let ret = {}
    ret.keywords = (result) ? _getKeywords(result) : []
    if(typeof query!=='undefined' && typeof query.keywords!=='undefined'){
        let regex = new RegExp(query.keywords)
        ret.dataset = rows.filter( (o) => {
            return regex.test(o.keywords)
        })
    } else ret.dataset = rows
    return ret
}

MongoClient.connect(DB_URL, (err,database) => {
    if(err) return console.log('Error connecting to database. ',err)
    db = database
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname,'public')))
app.set('view engine','ejs')

// Allow cross site so I can run the frontend on another port locally
app.use(function(req, resp, next) {
   resp.header("Access-Control-Allow-Origin", "*");
   resp.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

/**
 * API routes
 */

app.get('/api/questions', (req,res) => {
    if(db){
        db.collection(COLLECTION).find().toArray( (err,result) => {
            if(err) return console.log(err)
            res.json( _getResponseDataObject(result) )
        })
    } else res.json( {err:noDbConnError.error} )
})

app.get('/api/question/:id', (req,res) => {
    if(db){
        db.collection(COLLECTION)
        .findOne({uid:req.params.id},(err,result) => {
            if(err) return console.log(err)
            res.json(result)
        })
    } else res.json(noDbConnError)
})

/**
 * Static serve routes
 */

app.get('/', (req,res) => {
    if(db){
        db.collection(COLLECTION).find().toArray( (err,result) => {
            if(err) return console.log(err)
            res.render( path.join(__dirname,VW_INDEX), _getResponseDataObject(result) )
        })
    } else res.render(path.join(__dirname,VW_ERROR),{err:noDbConnError.error})
})

app.post('/', (req,res) => {
    if(db){
        let query
        if(typeof req.body.keywords!=='undefined'&&req.body.keywords!='') query={keywords:req.body.keywords}
        //console.log('query',query)
        db.collection(COLLECTION)
        .find().toArray( (err,result) => {
            if(err) return console.log(err)
            res.render(path.join(__dirname,VW_INDEX), _getResponseDataObject(result,query) )
        })
    } else res.json(noDbConnError)
})

app.get('/keywords',(req,res) => {
    if(db){
        let keywords = []
        db.collection(COLLECTION).find().toArray( (err,result) => {
            if(err) return console.log(err)
            res.json(_getKeywords(result))
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
            doc.keywords = ''

            if(req.body.keywords_sel) doc.keywords = req.body.keywords_sel.join()
            if(req.body.keywords_txt) doc.keywords = doc.keywords +','+ req.body.keywords_txt

            console.log('new doc: ',doc)
            db.collection(COLLECTION)
            .insert(doc, (err,result) => {
                if(err) return console.log(err)
                //console.log('question saved ',result)
                res.redirect('/')
            })
        } else{
            let doc = {}
            if(req.body.question) doc.question = req.body.question
            if(req.body.answer) doc.answer = req.body.answer
            // if(req.body.keywords_sel && req.body.keywords_sel.length>0) doc.keywords = req.body.keywords_sel.join()
            if(req.body.keywords_txt) doc.keywords = doc.keywords +','+ req.body.keywords_txt
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
