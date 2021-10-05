var express   = require('express');
var app       = express();
var fs        = require('fs'); 
var serverStatic = require('serve-static');
var path = require('path');

app.set('view engine', 'ejs');
app.use(serverStatic(path.join(__dirname, 'uploadedFiles')));
app.use(serverStatic(path.join(__dirname, 'routes')));
app.use('/', require('./routes/main'));

var port = 3005;
app.listen(port, function(){
  var dir = './uploadedFiles';
  if (!fs.existsSync(dir)) fs.mkdirSync(dir); 
  
  console.log('server on!');
});