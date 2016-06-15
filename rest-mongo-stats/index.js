var express = require('express');
var bodyParser = require('body-parser');
var mongo = require('mongodb');

var dbIp = process.env.DATABASE_IP || '127.0.0.1';
var dbPort = process.env.DATABASE_PORT || 27017;
var dbName = process.env.DATABASE_NAME || 'oabdebolso';

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
var server = new Server(dbIp, dbPort, {auto_reconnect: true});
var db = new Db(dbName, server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'oabdebolso' database");
        db.collection('stats', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'stats' collection doesn't exist. Creating it with sample data...");
            }
			app.listen(80, function () {
				console.log('App listening on port 80');
			});
        });
    }
});

app.post('/stats', function(req, res) {
	var data = req.body;
    db.collection('stats', function(err, collection) {
        collection.insert(data, {safe:true}, function(err, result) {
            if (err) {
				//console.log(err);
                res.status(500).send({'error':'An error has occurred'});
            } else {
                //console.log('Success: ' + JSON.stringify(result));
                res.status(200).send('Inserido com sucesso!');
            }
        });
    });	
});
