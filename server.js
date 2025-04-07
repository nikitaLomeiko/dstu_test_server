const express = require("express");
const jsonServer = require("json-server");
const path = require("path");

const dbPath = process.env.IS_SERVERLESS ? path.join("/tmp", "db.json") : path.join(__dirname, "db.json");

if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({ posts: [], users: [] }), "utf-8");
}
const router = jsonServer.router(dbPath);
const middlewares = jsonServer.defaults();

const app = express();

app.use(middlewares);
app.use("/api", router);

app.get("/", (req, res) => {
  res.json({
    message: "Сервер работает! Используйте /api для доступа к json-server.",
    endpoints: {
      getPosts: "GET /api/posts",
      addPost: "POST /api/posts",
    },
  });
});

module.exports = app;
