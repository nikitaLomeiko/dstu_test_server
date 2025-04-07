const express = require("express");
const jsonServer = require("json-server");
const path = require('path');


const db = path.join(__dirname, "db.json");
const router = jsonServer.router(db);
const middlewares = jsonServer.defaults();


const app = express();

app.use(middlewares);
app.use("/api", router);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Сервер работает! Используйте /api для доступа к json-server.',
    endpoints: {
      getPosts: 'GET /api/posts',
      addPost: 'POST /api/posts',
    }
  });
});

