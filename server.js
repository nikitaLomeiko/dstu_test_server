const express = require("express");
const jsonServer = require("json-server");
const path = require("path");
const fs = require("fs");

const dbPath = path.join(`${__dirname}/tmp`, "db.json")

const router = jsonServer.router(dbPath);
const middlewares = jsonServer.defaults();

console.log("Используемый путь к DB:", dbPath); // Проверить в логах Vercel

// Проверка существования файла
try {
  console.log("Файл существует?", fs.existsSync(dbPath));
  console.log("Содержимое файла:", fs.readFileSync(dbPath, "utf-8"));
} catch (err) {
  console.error("Ошибка при проверке файла:", err);
}

const app = express();
app.use(middlewares);
app.use("/api", router);

app.get("/", (req, res) => {
  res.json({ 
    message: "Сервер работает!",
    dbLocation: dbPath // Отправляем путь для отладки
  });
});

module.exports = app;
