// server side

const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const loginRouter = require("../src/router/login");
const https = require("http");
const Sockets = require("./controllers/socket/socket");
const fs = require("fs");

const app = express();

// const privateKey = fs.readFileSync("../localhost.key", "utf8");
// const certificate = fs.readFileSync("../localhost.csr", "utf8");

// const credentials = {
//   key: privateKey,
//   cert: certificate,
// };

const server = https.createServer( app);

Sockets.initialize(server);

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.set("strictQuery", true);
mongoose.connect("mongodb+srv://jay_kanani:UMqMOaAP8w1MVW4Q@cluster0.fzcunq6.mongodb.net/");

const publicDiractoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDiractoryPath));

require('./controllers/settings/settings')

const pricingRouter = require("../src/router/pricing");
const ridesRouter = require("../src/router/rides");
const usersRouter = require("../src/router/users");
const driversRouter = require("../src/router/drivers");
const SettingsRouter = require("../src/router/settings");

app.use(loginRouter);
app.use(ridesRouter);
app.use(usersRouter);
app.use(driversRouter);
app.use(pricingRouter);
app.use(SettingsRouter);

const cronService = require("./controllers/cronjob/crone");

cronService.getSettingData();
cronService.job.start();

server.listen(3000, () => {
  console.log("port is runiing...(at 3000)");
});
