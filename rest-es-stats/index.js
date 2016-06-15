var Elasticsearch = require('elasticsearch');
var express = require('express');
var bodyParser = require('body-parser');
var UuidBase26 = require('uuid-base62');
var Uuid = require('uuid');

// Colunas da tabela stats
//id int(11) - ID numérico autoincremental da tabela
//uuid binary(16) - UUID que identifica este evento
//device_id int(11)- ID numérico do device
//event text - Nome do evento que ocorreu no app, ex: 'simulado.concluido', 'questoes.corrigiu', etc
//params text - Parametros especificos do evento em json, no caso de 'questoes.corrigiu' pode ser { id_questao: 56, alternativa_marcada : 1 }
//time timestamp - Timestamp do horário que o evento ocorreu pelo celular do usuário
//create_date timestamp - Timestamp do horário em que o evento foi registrado no servidor

var dbIp = process.env.DATABASE_IP || 'localhost';
var dbPort = process.env.DATABASE_PORT || '9200';

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var elasticsearchClient = new Elasticsearch.Client({
	host: dbIp + ':' + dbPort, // Substituir aqui os dados do servidor elasticsearch que estiver rodando
	log: 'trace'
},function(){
	app.listen(80, function () {
		console.log('App listening on port 80');
	});	
}
);

app.post('/stats', function(req, res) {
	var objects = [];
	var row = req.body;
	
	// Dá parse no json da coluna params
	var params = null;

	if(row.event == "loginemail.email.ok"){
		try {
			params = JSON.parse('{"email" : ' + row.params + '}');
		} catch (e) {
			params = null;
		}
	}else{
		try {
			params = row.params;
		} catch (e) {
			params = null;
		}	
	}

	elasticsearchClient.index({
		index: 'stats',
		type: 'events',
		body: {
			DeviceId: row.device_id,
			event: row.event,
			params: params,
			date : new Date(row.time)				
		}
	}).then(function (resp) {
		res.status(200).send('Inserido com sucesso!');
	}).catch(function(){
		res.status(500).send({'error':'An error has occurred'});
	});
});

