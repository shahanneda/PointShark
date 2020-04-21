const express = require("express");
const app = express();
const port = 7772;

app.listen(port, function(){

        console.log("PointShark Server Started!");

});

app.use('/', express.static('client'))

