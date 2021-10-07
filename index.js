var express   = require('express');
var app       = express();
var fs        = require('fs'); 
var serverStatic = require('serve-static');
var path = require('path');
var cors = require('cors');
var bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.use(cors())
app.use(bodyParser.json())
app.use(serverStatic(path.join(__dirname, 'uploadedFiles')));
app.use(serverStatic(path.join(__dirname, 'routes')));
app.use('/', require('./routes/main'));

var port = 3005;
app.listen(port, function(){
  var dir = './uploadedFiles';
  var dir2 = './tempFile';
  if (!fs.existsSync(dir)) fs.mkdirSync(dir); 
  if (!fs.existsSync(dir2)) fs.mkdirSync(dir2); 
  
  console.log('server on!');
});

process.on('uncaughtException', console.error);