const express = require("express");
const jsonServer = require("json-server");
const path = require('path');


const db = path.join(__dirname, "./server/json/db.json");
const router = jsonServer.router(db);
const middlewares = jsonServer.defaults();


const app = express();
app.use(middlewares);
app.use("/api", router);
const port = 8080;

module.exports = (req, res) => {
  res.json({ message: "Hello from Vercel Serverless!!!!" });
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

