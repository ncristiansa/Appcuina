var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var $ = require('jquery');
fs = require('fs');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });


var express = require('express');
	app = express();

	app.get ('/', function(req, res){
		//var dbo = res.db("cocina");
		//var consulta = dbo.getCollection('recetas').find({});
		MongoClient.connect(url, function(err, db) {
		  if (err) throw err;
		  var dbo = db.db("videojuegos");

		  dbo.collection("videojuegos").find({}).toArray(function(err, result) {
			  var lista = "";
		    if (err) throw err;
				   boton_crear = "<a href=/crear>Añadir</a><br><br>";
				   for (const key in result) {

						li_nombre = "<li>"+result[key]["nombre"]+"</li>";

						id_asociada = result[key]["_id"];
						boton_editar = "<a href=/editar/"+id_asociada+">Editar</a>\t";
						boton_borrar = "<a href=/borrar/"+id_asociada+">Borrar</a><br>";
						lista_sin_sumar = li_nombre+boton_editar+boton_borrar;
						lista = lista + lista_sin_sumar;
				   }
				   res.send(boton_crear+lista);
					
		    	/*
		    result.forEach(function(receta){
		    });
		    */
		    db.close();
		  });
		});	
	});
	var formulario = '<form method="POST" action="/crear">\
						<label for="nombre">Nombre</label>\
						<input type="text" name="nombre" id="edad">\
						<br>\
						<label for="duracion">Duracion</label>\
						<input type="text" name="duracion">\
						<br>\
						<label for="descripcion">Descripcion</label>\
						<input type="text" name="descripcion">\
						<br>\
						<label for="tipo">Tipo</label>\
						<input type="text" name="tipo">\
						<br>\
						<input type="submit">\
					</form>';

	app.get ('/crear', function(req, res){
		//var dbo = res.db("cocina");
		//var consulta = dbo.getCollection('recetas').find({});
		/*
		MongoClient.connect(url, function(err, db) {
		  if (err) throw err;
		  var dbo = db.db("cocina");
			*/
		  res.send('<html><body>'
			  +formulario
			  + '</body></html>');
/*
		});	
*/
	});

	app.post ('/crear', function(req, res){
		//var dbo = res.db("cocina");
		//var consulta = dbo.getCollection('recetas').find({});

		var nombre = req;
		console.log(nombre);
		//var duracion = req.body.duracion || '';
		//var descripcion = req.body.descripcion || '';
		//var tipo = req.body.tipo || '';
	
		res.send('<html><body>'
			+ req
			+ formulario
			+ '</html></body>'
		);
		/*
		MongoClient.connect(url, function(err, db) {
		  if (err) throw err;
		  var dbo = db.db("cocina");
			
			
		  res.send(formulario);
		});	
		*/
	});

	var formulario = '<form method="post" action="/nacimiento">'
    + '<label for="edad">¿Qué edad tienes?</label>'
    + '<input type="text" name="edad" id="edad">'    
    + '<input type="submit" value="Enviar"/>'
    + '</form>';
 
var cabecera = '<h1>Naciste el año</h1>';
 
app.get('/nacimiento', function (req, res) {
 
    res.send('<html><body>'
            + cabecera
            + formulario
            + '</html></body>'
    );
 
});

app.post('/nacimiento',urlencodedParser, function (req, res) {
 
    var edad = req.body.edad || '';
    var nacimiento = '';
 
    if (edad != '')
        nacimiento = 2015 - edad;
 
    res.send('<html><body>'
            + cabecera
            + '<p>' + nacimiento + '</p>'
            + formulario
            + '</html></body>'
    );
 
});




	app.use(function(req, res){

		res.sendStatus(404);
	});

	var server = app.listen(3000, function(){
		var port = server.address().port;
		console.log('Express server listening on port %s', port);
	});

function generarDatos(){
$("body").append("p");
}