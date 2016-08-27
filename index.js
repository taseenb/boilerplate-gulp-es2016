var express = require('express');
var app = express();

var publicDir = '/prod';
var indexFile = publicDir + '/index.html';

app.set('port', (process.env.PORT || 5000));

app.get('/', function(req, res) {
  res.sendFile(__dirname + indexFile);
});

app.use(express.static(__dirname + publicDir));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
