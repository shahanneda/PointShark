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

        app.listen(port, function(){
                console.log("PointShark Server Started on port " + port);
        });

        app.post('/newUser', (req, res) => {
                const salt = bcrypt.genSaltSync(saltRounds);
                const hash = bcrypt.hashSync(req.body.password, salt);

                usersCollection.insertOne({
                        _id: req.body.id,
                        id: req.body.id,
                        currentPoints:10,
                        lastPoint: 10,
                        updateMessage:"",
                        lastUpdatedTime:Date.now(),
                        password: hash,
                });

        });
        app.post('/loginUser', (req, res) => {
                usersCollection.findOne({_id: req.body.id}, (err, user) =>{
                        console.log(req.body);
                        if(user != null){
                                res.send(bcrypt.compareSync(req.body.password, user.password));
                        }else{
                                res.send("notfound")
                        }

                });
        });

        app.get('/getUsers', (req, res) =>{
                usersCollection.find({_id: req.params.id}, (err, user) =>{
                        delete user.password;
                        res.send(JSON.stringify(user));
                });
        });
        app.use('/pointshark', express.static('client'))
}
