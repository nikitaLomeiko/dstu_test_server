const express = require('express');
const jsonServer = require('json-server');
const fs = require('fs');
const path = require('path');

// 1. Инициализация DB
const dbPath = '/tmp/db.json'; // Только так для Vercel!

// Создаем или копируем базу данных
const initDB = () => {
  try {
    // Если файл уже существует - проверяем его
    if (fs.existsSync(dbPath)) {
      const content = fs.readFileSync(dbPath, 'utf-8');
      JSON.parse(content); // Проверяем валидность JSON
      console.log('DB существует и валидна');
      return;
    }

    // Пытаемся скопировать из проекта (если есть)
    const projectDbPath = path.join(__dirname, 'db.json');
    if (fs.existsSync(projectDbPath)) {
      fs.copyFileSync(projectDbPath, dbPath);
      console.log('DB скопирована из проекта');
      return;
    }

    // Создаем новую DB
    const defaultData = {
      reviews: [ // Пример данных
        { id: 1, text: "Отличный товар", rating: 5 },
        { id: 2, text: "Не понравилось", rating: 2 }
      ]
    };
    fs.writeFileSync(dbPath, JSON.stringify(defaultData));
    console.log('Создана новая DB с тестовыми данными');
  } catch (err) {
    console.error('Ошибка инициализации DB:', err);
    process.exit(1); // Завершаем процесс при критической ошибке
  }
};

// 2. Инициализируем DB перед запуском сервера
initDB();

// 3. Настройка сервера
const app = express();
const router = jsonServer.router(dbPath);
const middlewares = jsonServer.defaults();

app.use(middlewares);
app.use('/api', router);

// 4. Эндпоинт для отладки
app.get('/debug', (req, res) => {
  try {
    const dbContent = fs.readFileSync(dbPath, 'utf-8');
    res.json({
      status: 'OK',
      dbPath,
      dbExists: fs.existsSync(dbPath),
      dbContent: JSON.parse(dbContent)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = app;