const express = require("express");
const app = express();
const fs = require("fs");
const serverStatic = require("serve-static");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(cors());
app.use(bodyParser.json());
app.use(serverStatic(path.join(__dirname, "uploadedFiles")));
app.use(serverStatic(path.join(__dirname, "routes")));
app.use("/", require("./routes/main"));

const PORT = 3005;
app.listen(PORT, function () {
  const dir = "./uploadedFiles";
  const dir2 = "./tempFile";
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  if (!fs.existsSync(dir2)) fs.mkdirSync(dir2);

  console.log("server on!");
});

process.on("uncaughtException", console.error);
