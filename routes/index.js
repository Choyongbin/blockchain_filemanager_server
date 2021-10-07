const express = require("express");
const SHA256 = require("crypto-js/sha256");
const router = express.Router();
const multer = require("multer");
const mysql = require("mysql");
const fs = require("fs");
const fr = require("filereader"),
  filereader = new fr();
const mime = require("mime");
const path = require("path");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "fileNFT",
});

connection.connect();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploadedFiles/");
  },
  filename(req, file, cb) {
    //cb(null, `${Date.now()}__${file.originalname}`);
    cb(null, `${file.originalname}`);
  },
});
const tempStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "tempFile/");
  },
  filename(req, file, cb) {
    //cb(null, `${Date.now()}__${file.originalname}`);
    cb(null, `${file.originalname}`);
  },
});

const uploadWithOriginalFilename = multer({
  storage: storage,
});

const tempUpload = multer({
  storage: tempStorage,
});

const isValidFileName = (fileName) => {
  const invalids = ["..", "/"];
  let isValid = true;
  invalids.map((invalid) => {
    if (fileName.includes(invalid)) isValid = false;
  });
  return isValid;
};
const hashFileAsync = (path, filename, onfileHashed) => {
  fs.readFile(path + filename, (err, data) => {
    if (err) {
      console.error(err);
      onfileHashed(null);
    } else {
      const filehash = SHA256(data.toString()).toString();
      //connection.query('INSERT INTO file(hash, path) value(\'' + filehash + '\' , ' + '\''+ filename +'\')');
      onfileHashed(filehash);
    }
  });
};

//get all info of uploaded files
router.get("/", (req, res, next) => {
  connection.query("SELECT * FROM file", function (err, result) {
    if (err) {
      console.error(err);
      res.status(500).end();
      return;
    }

    res.status(200).json({ files: result }).end();
  });
});
//get file from nft
router.get("/:nft", (req, res, next) => {
  const { nft } = req.params;

  connection.query("SELECT * FROM file WHERE hash=?", [nft], function (err, result) {
    if (err) {
      console.log(err);
      res.status(500).end();
      return;
    }
    if (result.length === 0) {
      res.status(404).end();
      return;
    }

    const mimetype = mime.lookup(result[0].path);
    const options = { root: path.join("uploadedFiles/") };

    res.type(mimetype).sendFile(result[0].path, options, (e) => {
      if (e) next(e);
    });
  });
});
//create new file and return file hash
router.post("/", uploadWithOriginalFilename.single("attachment"), (req, res, next) => {
  const fileName = req.file.originalname;
  hashFileAsync("uploadedFiles/", fileName, (hash) => {
    if (hash) {
      res.status(200).json({ hash }).end();
    } else {
      next({
        message: "해시할 수 없습니다",
      });
    }
  });
});
//get hash from uploaded file
router.post("/hash", tempUpload.single("attachment"), (req, res, next) => {
  if (!req.file) {
    res.status(400).json({ message: "attachment에 파일을 입력하세요" }).end();
    return;
  }

  const fileName = req.file.originalname;
  if (!isValidFileName(fileName)) {
    res.status(400).json({ message: "파일명에 허용되지 않는 문자열이 있습니다" }).end();
    return;
  }
  hashFileAsync("tempFile/", fileName, (hash) => {
    if (hash) {
      fs.unlinkSync(`tempFile/${fileName}`);
      res.status(200).json({ hash }).end();
    } else {
      next({
        message: "해시할 수 없습니다",
      });
    }
  });
});

module.exports = router;
