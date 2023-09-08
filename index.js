const express = require("express");
require("dotenv").config();

const router = require("./src/routes");
const cors = require("cors");

// import package
const http = require("http");

const app = express();

const server = http.createServer(app);

const port = 5000;

app.use(express.json());
app.use(cors());

app.use("/api/v1/", router);
app.use("/uploads", express.static("uploads"));

// Ganti App menjadi Server
server.listen(port, () => console.log(`Listening on port ${port}`));