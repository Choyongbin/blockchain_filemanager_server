//const WhatapAgent = require("whatap").NodeAgent;

const express = require("express");
const app = express();
const fs = require("fs");
//const serverStatic = require("serve-static");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const http= require('http');

app.set("view engine", "ejs");
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "uploadedFiles")));
app.use(express.static(path.join(__dirname, "routes")));
app.use("/", require("./routes/main"));
app.use("/files", require("./routes/index"));
app.use((err, req, res, next)=>{
	console.error(err);
	res.status(err.status||500).json(err).end();
});

const requiredDirs = ["./uploadedFiles", "./tempFile"];
requiredDirs.forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
});

const PORT = 3004;

const server= http.createServer(app);
server.listen(PORT);

console.log("server on!");

process.on("uncaughtException", console.error);

module.exports= app;
