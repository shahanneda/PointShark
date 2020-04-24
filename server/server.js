const express = require("express");
const app = express();
const port = 7772;

const mongo = require("mongodb");
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

const bcrypt = require('bcrypt');
const saltRounds = 10;
let db = null;

let usersCollection = null;
MongoClient.connect(url, function(err, dbtemp) {

        var dbo = dbtemp.db("pointshark");

        db = dbo;
        dbo.createCollection("users", function(err, res) {
        }); 
        usersCollection = dbo.collection("users");
        mongoSetUpDone();
});

function mongoSetUpDone(){

        app.use(express.json());       // to support JSON-encoded bodies
        app.use(express.urlencoded()); // to support URL-encoded bodiesk
        // Add headers
        app.use(function (req, res, next) {

                // Website you wish to allow to connect
                res.setHeader('Access-Control-Allow-Origin', '*');

                // Request methods you wish to allow
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

                // Request headers you wish to allow
                res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

                // Set to true if you need the website to include cookies in the requests sent
                // to the API (e.g. in case you use sessions)
                res.setHeader('Access-Control-Allow-Credentials', true);

                // Pass to next layer of middleware
                next();
        });

        app.listen(port, function(){
                console.log("PointShark Server Started on port " + port);
        });

        app.post('/newUser', (req, res) => {
                const salt = bcrypt.genSaltSync(saltRounds);
                const hash = bcrypt.hashSync(req.body.password, salt);
                usersCollection.findOne({_id: req.body.id}, (err, user) =>{
                        if(user != null || user != undefined){
                                res.send("duplicate");
                                return;
                        }
                        usersCollection.insertOne({
                                _id: req.body.id,
                                id: req.body.id,
                                currentPoints:10,
                                lastPoints: 10,
                                updateMessage:"",
                                lastUpdatedTime:Date.now(),
                                isAdmin:false,
                                password: hash,
                        });
                        res.send("new user added");

                });


        });
        app.post('/loginUser', (req, res) => {
                res.setHeader('Content-Type', 'application/json');
                usersCollection.findOne({_id: req.body.id}, (err, user) =>{
                        if(user != null){
                                res.send(JSON.stringify({correctPass: bcrypt.compareSync(req.body.password, user.password)}));
                        }else{
                                res.send(JSON.stringify({correctPass: false}));
                        }

                });
        });

        app.post('/setCurrentScore', (req, res) => {
                usersCollection.findOne({_id: req.body.id}, (err, user) => {
                        if(user == null || user == undefined || err){
                                res.send("not found");
                                return;
                        }
                        usersCollection.update({_id: req.body.id}, {
                                $set: {
                                        currentPoints: req.body.points, 
                                        lastPoints: user.currentPoints,
                                        lastUpdatedTime: Date.now()
                                }
                        });
                        res.send("success");

                });
               console.log("set score for " + req.body.id ); 

        });
        app.get('/getUsers', (req, res) =>{
                usersCollection.find({}).toArray( (err, users) =>{
                        let usersToSend = {};
                        users.map( (user, index)=>{
                                delete users[index].password;
                                usersToSend[user.id] = users[index];
                        });
                        res.setHeader('Content-Type', 'application/json');

                        res.send(JSON.stringify(usersToSend));
                });
        });
        app.post('/userExists', (req, res) => {
                res.setHeader('Content-Type', 'application/json');
                usersCollection.findOne({_id: req.body.id}, (err, user) => {
                        if(user == null || user == undefined || err){
                                res.send(JSON.stringify({exists: false}));
                                return;
                        }
                        res.send(JSON.stringify({exists: true}));

                });

        });

        app.use('/pointshark', express.static('client'))
}
