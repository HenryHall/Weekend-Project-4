var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/toDo';

app.listen(8000, 'localhost', function(req, res){
  console.log("We made it fam, 8000");
});

app.use(express.static('public'));

app.get('/', function(req, res){
  console.log("Blessed be, based URL");
  res.sendFile(path.resolve('./views/index.html'));
});

app.get('/retrieveList', function(req, res){
  console.log("In retrieveList, getting tasks...");
  var results = [];

  pg.connect(connectionString, function(err, client, done){
    var query = client.query("SELECT * FROM task_table ORDER BY complete, date DESC");
    query.on('row', function(row){
      results.push(row);
    });
    query.on('end', function(){
      console.log("/retrieveList END");
      return res.json(results);
    });
    done();
  });


});//End /retrieveList

app.post( '/createTask', urlencodedParser, function( req, res ){
  console.log("In createTask with: " + req.body.name);
  pg.connect(connectionString, function(err, client, done){
    var query = client.query("INSERT INTO task_table (task) VALUES ($1)", [req.body.name]);
    done();
  });
  res.end();
});

app.post( '/completeTask', urlencodedParser, function( req, res ){
  console.log("In completeTask with: " + req.body.name + " " + req.body.complete);

  pg.connect(connectionString, function(err, client, done){
    var query = client.query("UPDATE task_table SET complete = '" + req.body.complete + "' WHERE task = '" + req.body.name + "'");
    done();
  });
  res.end();
});

app.post( '/deleteTask', urlencodedParser, function( req, res ){
  console.log("In deleteTask with: " + req.body.name);

  pg.connect(connectionString, function(err, client, done){
    var query = client.query("DELETE from task_table WHERE task = '" + req.body.name + "'");
    done();
  });
  res.end();
});
