var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var URL = 'mongodb://localhost:27017/';
var fs = require('fs');
var bodyParser = require('body-parser');
var URLencodeParser = bodyParser.urlencoded({extended: false});
var ObjectID = require('mongodb').ObjectID;

/**
 * Conexión a MongoDB
 */
MongoClient.connect(URL, function(err, db){
	assert.equal(null, err);
	/**
	 * Mostraremos un mensaje por consola el cual comunicará que la conexión se ha establecido correctamente.
	 */
	console.log("Conectados correctamente.");
	var dbo=db.db('videojuegos');
	dbo.collection('videojuegos').find({}).toArray(function(err, docs){
		docs.forEach(function(doc){
			/**
			 * Mostraremos el campo tipo de nuestra tabla
			 */
			console.log(doc.tipo);
		});
		db.close();
	});
	console.log("Ejecutando funcion find");
});
app.get("/", function(req, res){
	MongoClient.connect(URL, function(err, db){
		assert.equal(null, err);
		console.log("Conectados correctamente");
		var dbo=db.db("videojuegos");
		dbo.collection("videojuegos").find({}).toArray(function(err, docs){
			var listaJuegos= "";
			var inputBusqueda = '<input id="busqueda" type="text" name="busqueda">\
			<input class="btn btn-primary" name="buscar" value="buscar">';
			
			var tabla_abre = '<table class="table">\
			<thead class="thead-dark">\
			<tr>\
			<th scope="col">Id</th>\
			<th scope="col">Nombre</th>\
			<th scope="col">Plataforma</th>\
			<th scope="col">Tipo</th>\
			</tr>\
			</thead>\
			<tbody>';
			docs.forEach(function(doc){
				console.log("NOMBRE JUEGO"+doc.nombre);
				var tr_Id = "<tr><td>"+doc._id+"</td>";
				var tr_nombre = "<td>"+doc.nombre+"</td>"
				var tr_plataforma = "<td>"+doc.plataforma+"</td>";
				var tr_tipo = "<td>"+doc.tipo+"</td>";
				var id_videojuego = doc._id;
				var botonEdit = "<td><a class='btn btn-link' href=http://localhost:3000/modificar/"+id_videojuego+">Editar</a></td>";
				var botonDel = "<td><a class='btn btn-link' href=http://localhost:3000/eliminar/"+id_videojuego+">Eliminar</a></td>";
				var tr_cierra = "</tr>";
				var tabla= tr_Id+tr_nombre+tr_plataforma+tr_tipo+botonEdit+botonDel+tr_cierra;
				listaJuegos=listaJuegos+tabla;
			});
			var cierra_tabla = "</tbody>\
			</table>";
			var botonCrear = '<a class="btn btn-primary"  href="http://localhost:3000/insertar" >Crear</a>';
			var tabla_final = inputBusqueda+tabla_abre+listaJuegos+cierra_tabla+botonCrear;
			fs.readFile("cabecera.html", "utf8",(err, data)=>{
				if(err){
					console.log(err);
					return err;
				}else{
					res.send(data+tabla_final);
				}
			});
			db.close();
		});

	});
});
//Genera el formulario para insertar
app.get("/insertar",function(req, res){
	var formulario = '<form method="POST">\
	<div class="form-group"><label for="nombre">Nombre del Juego</label>\
	<input class="form-control" type="text" name="nombre">\
	<br></div>\
	<div class="form-group"><label for="duracion">Plataforma</label>\
	<input class="form-control" type="text" name="plataforma">\
	<br></div>\
	<div class="form-group"><label for="descripcion">Tipo</label>\
	<input class="form-control" type="text" name="tipo">\
	<br></div>\
	<input type="submit" value="Añadir">\
	</form>';
	fs.readFile("cabecera.html","utf8",(err,data)=>{
		if(err){
				console.log(err);
				return err;
		}else{
				res.send(data+formulario);
		}
	});
});

//Obtiene los datos de los inputs y añade un nuevo elemento a nuestra db
app.post("/insertar", URLencodeParser, function(req, res){
	var inputNom = req.body.nombre;
	var inputPlat = req.body.plataforma;
	var inputTipo = req.body.tipo;

	MongoClient.connect(URL, function(err, db){
		if(err) throw err;
		var dbo = db.db("videojuegos");
		var miobjecto = {nombre: inputNom, plataforma:inputPlat, tipo:inputTipo};
		dbo.collection("videojuegos").insertOne(miobjecto, function (err, res){
			if(err) throw err;
			console.log("Un nuevo juego ha sido insertado");
			db.close();
		});
		res.redirect("/");
	});
});
app.get('/eliminar/:id',function(req,res){
	var idJuego = req.params.id;

	MongoClient.connect(URL, function(err, db) {
	if (err) throw err;
	var dbo = db.db("videojuegos");
	var consulta = { _id: idJuego };
	dbo.collection("videojuegos").deleteOne({_id: new ObjectID(idJuego)});
	console.log("El juego ha sido eliminado correctamente.");
	res.redirect("/");
	});
});
app.get('/modificar/:id',function(req,res){
	var idJuego = req.params.id;
	 MongoClient.connect(URL, function(err, db) {
			if (err) throw err;
			var dbo = db.db("videojuegos");
			dbo.collection('videojuegos').findOne({_id: new ObjectID(idJuego)},function(err, docs){
					 var modificar = '<form method="POST" action="http://localhost:3000/modificar/'+[idJuego]+'">\
					 <div class="form-group"><label for="nombre">Nombre del Juego</label>\
					<input class="form-control" type="text" name="nombre" value="'+docs["nombre"]+'">\
					<br></div>\
					<div class="form-group"><label for="duracion">Plataforma</label>\
					<input class="form-control" type="text" name="plataforma" value="'+docs["plataforma"]+'">\
					<br></div>\
					<div class="form-group"><label for="descripcion">Tipo</label>\
					<input class="form-control" type="text" name="tipo" value="'+docs["tipo"]+'">\
					<br></div>\
					<input type="submit" value="Guardar">\
					</form>';

					 fs.readFile("cabecera.html","utf8",(err,data)=>{
							if(err){
									console.log(err);
									return err;
							}else{
									res.send(data+modificar);
							}
					});
			});
	});
});
app.post('/modificar/:id',URLencodeParser,function(req,res){
	var idJuego = req.params.id;

	var inputNom = req.body.nombre;
	var inputPlat = req.body.plataforma;
	var inputTipo = req.body.tipo;

	MongoClient.connect(URL, function(err, db) {
			if (err) throw err;
					var dbo = db.db("videojuegos");
			var jsquery = {_id: new ObjectID(idJuego)};
					var newvalues = { $set: { nombre: inputNom, plataforma: inputPlat, tipo: inputTipo} };
					dbo.collection('videojuegos').updateOne(jsquery, newvalues, function(err, result){

							console.log("El videojuego ha sido modificado");
							res.redirect("/");
	
					});
			});
});
app.use(function(req, res){
	res.sendStatus(404);
});
var server = app.listen(3000, function(){
	var port = server.address().port;
	console.log("Express server listening on port %s", port);
});