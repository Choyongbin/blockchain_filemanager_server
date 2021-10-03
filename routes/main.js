var express  = require('express');
const SHA256 = require('crypto-js/sha256');
var router   = express.Router();
var multer   = require('multer'); 
const mysql = require('mysql');

const connection = mysql.createConnection({
  host : '3.37.53.134',
  user : 'root',
  password : '1234',
  database : 'fileNFT'
});

connection.connect()


var storage  = multer.diskStorage({ 
  destination(req, file, cb) {
    cb(null, 'uploadedFiles/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}__${file.originalname}`);
  },
});
var upload = multer({ dest: 'uploadedFiles/' }); 
var uploadWithOriginalFilename = multer({ storage: storage }); 

router.get('/', function(req,res){
  res.render('upload');
});

router.post('/uploadFile', upload.single('attachment'), function(req,res){ 
  res.render('confirmation', { file:req.file, files:null });
  var aa = SHA256(req.file).toString()
  //console.log(aa)
  connection.query('INSERT INTO file(hash) value(' + aa + ')');
});

router.post('/uploadFileWithOriginalFilename', uploadWithOriginalFilename.single('attachment'), function(req,res){ 
  res.render('confirmation', { file:req.file, files:null });
});

router.post('/uploadFiles', upload.array('attachments'), function(req,res){
  res.render('confirmation', { file : null, files:req.files} );
});

router.post('/uploadFilesWithOriginalFilename', uploadWithOriginalFilename.array('attachments'), function(req,res){ 
  res.render('confirmation', { file:null, files:req.files });
});

module.exports = router;