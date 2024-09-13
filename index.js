/*
Домашня работа

Напишите HTTP сервер на express и реализуйте два обработчика “/” и “/about”, где:

— На каждой странице реализован счетчик просмотров
— Значение счетчика необходимо сохранять в файл каждый раз, когда обновляется страница
— Также значение счетчика должно загружаться из файла, когда запускается обработчик страницы
— Таким образом счетчик не должен обнуляться каждый раз, когда перезапускается сервер.

Подсказка:
Вы можете сохранять файл в формате JOSN,
где в объекте ключом будет являться URL страницы, а значением количество просмотров страницы

Формат сдачи работы:
— Ссылка на гитхаб/гитлаб
— Файл с кодом.
*/

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const pathJSON = path.join(__dirname, "countPage.json");

if (!fs.existsSync(pathJSON)) {
    const countPage = [
        {
            page: "/",
            count: 0
        },
        {
            page: "/about",
            count: 0
        },
    ]
    fs.writeFile(pathJSON, JSON.stringify(countPage, null, 2), (error) => {
        if (error) return console.log(error);
    });
}

app.get('/', (req, res) => {
    fs.readFile(pathJSON, "utf-8", (error, data) => {
        if (error) return console.log(error);
        let dataPage = JSON.parse(data, "utf-8");
        dataPage[0].count += 1;
        fs.writeFile(pathJSON, JSON.stringify(dataPage, null, 2), (error) => {
            if (error) return console.log(error);
        });
        res.send(`
          <h1>Главная страница</h1>
          <p>Просмотров ${dataPage[0].count}</p>
          <a href="/about">About</a>
       `);
    });
});

app.get('/about', (req, res) => {
    fs.readFile(pathJSON, "utf-8", (error, data) => {
        if (error) return console.log(error);
        let dataPage = JSON.parse(data, "utf-8");
        dataPage[1].count += 1;
        fs.writeFile(pathJSON, JSON.stringify(dataPage, null, 2), (error) => {
            if (error) return console.log(error);
        });
        res.send(`
          <h1>Страница About</h1>
          <p>Просмотров ${dataPage[1].count}</p>
          <a href="/">Главная страница</a>
       `);
    });
});

app.listen(3000, () => console.log("Сервер запущен"));