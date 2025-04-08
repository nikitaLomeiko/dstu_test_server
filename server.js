const express = require("express");
const jsonServer = require("json-server");
const path = require("path");
const fs = require("fs");

// В Vercel используем только /tmp (не __dirname!)
const dbPath = "/tmp/db.json"; // Жёстко прописываем путь

console.log("Используемый путь к DB:", dbPath);

// Гарантируем, что файл существует
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({ posts: [] }));
  console.log("Создан новый файл DB");
}

const router = jsonServer.router(dbPath);
const middlewares = jsonServer.defaults();

const app = express();
app.use(middlewares);
app.use("/api", router);

app.get("/", (req, res) => {
  res.json({ 
    message: "Сервер работает!",
    dbLocation: dbPath,
    filesInTmp: fs.readdirSync("/tmp") // Для отладки
  });
});

module.exports = app;
