var express  = require('express');
const SHA256 = require('crypto-js/sha256');
var router   = express.Router();
var multer   = require('multer'); 
const mysql = require('mysql');
const fs = require('fs');
const fr = require('filereader'), filereader = new fr()

const connection = mysql.createConnection({
  host : 'localhost',
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
    //cb(null, `${Date.now()}__${file.originalname}`);
    cb(null, `${file.originalname}`);
  },
});

var upload = multer({ dest: 'uploadedFiles/' }); 
var uploadWithOriginalFilename = multer({ 
  storage : storage
}); 

function getFileRedaer(filename){
  fr.readAsDataURL(new File('uploadedFiles/' + filename))

  fr.on('data', function(data){
    console.log(data)
  })
}

function getStream(filename, onfileHashed){
  const readStream = fs.readFile('uploadedFiles/' + filename, (err, data)=>{
    if(err){
      console.log(err)
      onfileHashed(null)
    }
    else{
      var filehash = SHA256(data.toString()).toString()
      connection.query('INSERT INTO file(hash, path) value(\'' + filehash + '\' , ' + '\''+ filename +'\')');
      onfileHashed(filehash)
    }
  })
}

router.get('/', function(req,res){
  
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
    
  res.render('upload');
});

router.post('/uploadFile', upload.single('attachment'), function(req,res){ 
  res.render('confirmation', { file:req.file, files:null });
  
  getStream(req.file.originalname, hash =>{
    if(!hash){
      res.status(500).end()
      return
    }
    else{
      res.status(200).json({hash}).end()
    }
  })
});

router.post('/uploadFileWithOriginalFilename', uploadWithOriginalFilename.single('attachment'), function(req,res){ 
  res.render('confirmation', { file:req.file, files:null });
  getStream(req.file.originalname, hash =>{
    if(!hash){
      res.status(500).end()
      return
    }
    else{
      res.status(200).json({hash}).end()
    }
  })
});

router.post('/uploadFiles', upload.array('attachments'), function(req,res){
  res.render('confirmation', { file : null, files:req.files} );
  
  getStream(req.file.originalname, hash =>{
    if(!hash){
      res.status(500).end()
      return
    }
    else{
      res.status(200).json({hash}).end()
    }
  })
});

router.post('/uploadFilesWithOriginalFilename', uploadWithOriginalFilename.array('attachments'), function(req,res){ 
  res.render('confirmation', { file:null, files:req.files });
  getStream(req.file.originalname, hash =>{
    if(!hash){
      res.status(500).end()
      return
    }
    else{
      res.status(200).json({hash}).end()
    }
  })
});

module.exports = router;