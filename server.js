const express = require("express");
const jsonServer = require("json-server");
const path = require("path");
const fs = require("fs");

// Путь к БД — всегда /tmp/db.json в serverless-среде
const dbPath = process.env.IS_SERVERLESS
  ? path.join("/tmp", "db.json")
  : path.join(__dirname, "db.json");

// Если это serverless-среда, гарантируем, что db.json есть в /tmp
if (process.env.IS_SERVERLESS) {
  try {
    // Пытаемся скопировать db.json из проекта в /tmp
    fs.copyFileSync(path.join(__dirname, "db.json"), dbPath);
    console.log('Файл данных успешно скопирован в ', dbPath)
  } catch (err) {
    // Если файла нет (например, при первом запуске), создаём пустой
    fs.writeFileSync(dbPath, JSON.stringify({ posts: [], users: [] }));
    console.log('Файл данных не найден. Создан новый файл')
  }
}

// Инициализируем json-server с указанием пути к /tmp/db.json
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
