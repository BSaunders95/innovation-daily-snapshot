var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var Case = require('case');

var app = express();

app.use(cors());
app.use(bodyParser.json())

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

app.get('/department/:dept/snapshot', function(req, res) {

  time = parseInt(req.query.time, 10);
  dept = Case.snake(req.params.dept);

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("daily_snapshot");
    dbo.collection(dept).find().sort({"date": -1}).limit(time).toArray(function(err, result) {
      if (err) throw err;

      var xAxis = [];
      var yAxis = [];

      for (var i = result.length - 1; i >= 0; i--) {
        xAxis.push(result[i].date);
        yAxis.push(result[i].currentDay);
      }

      var data = [xAxis, yAxis];

      db.close();

      res.write(JSON.stringify(data));
      res.end();
    });
  });

});

app.get('/department/:dept/snapshot/history', function(req, res) {

  dept = Case.snake(req.params.dept);

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("daily_snapshot");
    dbo.collection(dept).find().sort({"date": -1}).toArray(function(err, result) {
      if (err) throw err;

      db.close();

      res.write(JSON.stringify(result));
      res.end();
    });
  });

});

app.get('/department/:dept/snapshot/currentDay', function(req, res) {

  dept = Case.snake(req.params.dept);

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("daily_snapshot");
    dbo.collection(dept).find().sort({"date": -1}).limit(1).toArray(function(err, result) {
      if (err) throw err;
      // Set standardized data; i.e: current day today = 0. This is incase no data exists to avoid an NPE
      var data = {'currentDay': 0, 'date': new Date().toISOString().split('T')[0]}
      if (result.length > 0) {
        data.currentDay = result[0].currentDay
        data.date = result[0].date
      }
      db.close();

      res.write(JSON.stringify(data));
      res.end()
    });
  });
});

app.get('/department/:dept/snapshot/day', function(req, res) {

  dept = Case.snake(req.params.dept);
  date = req.query.date;

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("daily_snapshot");
    dbo.collection(dept).find({"date": date}).project({_id: 0}).toArray(function(err, result) {
      if (err) throw err;

      db.close();
      res.write(JSON.stringify(result));
      res.end();
    });
  });
});

app.post('/department/:dept/snapshot', function(req, res) {

  dept = Case.snake(req.params.dept);
  snapshot = req.body;

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("daily_snapshot");
    dbo.collection(dept).deleteOne({"date": snapshot.date}, function(err, result) {
      if (err) throw err;
      dbo.collection(dept).insertOne(snapshot, function(err, result) {
        if (err) throw err;
        db.close();
      });
    });
  });

});

app.listen(8081);
