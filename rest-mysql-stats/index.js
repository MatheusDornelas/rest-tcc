var Sequelize = require('sequelize');
var express = require('express');
var bodyParser = require('body-parser');

var dbIp = process.env.DATABASE_IP || '127.0.0.1';
var dbPort = process.env.DATABASE_PORT || 3306;
var dbUsername = process.env.DATABASE_USERNAME || 'root';
var dbPassword = process.env.DATABASE_PASSWORD || '';
var dbDialect = process.env.DATABASE_DIALECT || 'mysql';
var dbName = process.env.DATABASE_NAME || 'rest-mysql-stats';

var sequelize = new Sequelize(dbDialect + '://' + dbUsername + ':' + dbPassword + '@' + dbIp + ':' + dbPort + '/' + dbName);

var Stats = sequelize.define('stats', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	device_id: {
		type: Sequelize.INTEGER
	},
	event: {
		type: Sequelize.TEXT
	},
	params: {
		type: Sequelize.TEXT
	},
	time: {
		type: Sequelize.DATE
	}
});

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

sequelize.sync().then(function() {
	
	app.listen(80, function () {
		
		console.log('App listening on port 80');
	});

	app.post('/stats', function(req, res) {
		
		Stats.create({
			device_id: req.body.device_id,
			event: req.body.event,
			params: req.body.params,
			time: req.body.time
		}).then(function() {
			
			res.status(200);
			res.send();
		}).catch(function(e) {
			
			console.log(e);
			res.status(500);
			res.send();
		});
		
	});
}).catch(function(e) {
	console.log('Error connecting to database', e);
});
