var express  = require('express');
const SHA256 = require('crypto-js/sha256');
var router   = express.Router();
var multer   = require('multer'); 
const mysql = require('mysql');
/*
const connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : '1234',
  database : 'fileNFT'
});

connection.connect()
*/

var storage  = multer.diskStorage({ 
  destination(req, file, cb) {
    cb(null, 'uploadedFiles/');
  },
  filename(req, file, cb) {
    //cb(null, `${Date.now()}__${file.originalname}`);
    cb(null, `${file.originalname}`);
  },
});
var upload = multer({ dest: 'uploadedFiles/' }); 
var uploadWithOriginalFilename = multer({ storage: storage }); 

router.get('/', function(req,res){
  /*
  var sql = 'SELECT path from file'
    connection.query(sql, function(err, rows, fields){
        if(err){
            console.log(err)
        }
        else{
            for(var i = 0; i<rows.lenght; i++){
                console.log(rows[i].description)
            }
        }
    })
    */
  res.render('upload');
});

router.post('/uploadFile', upload.single('attachment'), function(req,res){ 
  res.render('confirmation', { file:req.file, files:null });
  var aa = SHA256(req.file).toString()
  //console.log(req.file)
  //console.log(req.file.buffer)
  var path = '/uploadFiles/' + req.file.originalname
  //console.log(path)
  //connection.query('INSERT INTO file(hash, path) value(\'' + aa + '\' , ' + '\''+ path +'\')');
  //console.log('INSERT INTO file(hash, path) value(\'' + aa + '\' , ' + '\''+ path +'\')')
});

router.post('/uploadFileWithOriginalFilename', uploadWithOriginalFilename.single('attachment'), function(req,res){ 
  res.render('confirmation', { file:req.file, files:null });
  var aa = SHA256(req.file).toString()
  //console.log(req.file)
  //console.log(req.file.buffer)
  var path = '/uploadFiles/' + req.file.originalname
  //console.log(path)
  //connection.query('INSERT INTO file(hash, path) value(\'' + aa + '\' , ' + '\''+ path +'\')');
  //console.log('INSERT INTO file(hash, path) value(\'' + aa + '\' , ' + '\''+ path +'\')')
});

router.post('/uploadFiles', upload.array('attachments'), function(req,res){
  res.render('confirmation', { file : null, files:req.files} );
  var aa = SHA256(req.file).toString()
  //console.log(req.file)
  //console.log(req.file.buffer)
  var path = '/uploadFiles/' + req.file.originalname
  //console.log(path)
  //connection.query('INSERT INTO file(hash, path) value(\'' + aa + '\' , ' + '\''+ path +'\')');
  //console.log('INSERT INTO file(hash, path) value(\'' + aa + '\' , ' + '\''+ path +'\')')
});

router.post('/uploadFilesWithOriginalFilename', uploadWithOriginalFilename.array('attachments'), function(req,res){ 
  res.render('confirmation', { file:null, files:req.files });
  var aa = SHA256(req.file).toString()
  //console.log(req.file)
  //console.log(req.file.buffer)
  var path = '/uploadFiles/' + req.file.originalname
  //console.log(path)
  //connection.query('INSERT INTO file(hash, path) value(\'' + aa + '\' , ' + '\''+ path +'\')');
  //console.log('INSERT INTO file(hash, path) value(\'' + aa + '\' , ' + '\''+ path +'\')')
});

module.exports = router;