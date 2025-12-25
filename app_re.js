"use strict";

const express = require("express");
const fs = require("fs"); // ファイル操作用
const app = express();
const path = require("path");

app.set('view engine', 'ejs');
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// --- データの読み書き共通関数 ---
function loadData(filename) {
    try {
        if (fs.existsSync(filename)) {
            const data = fs.readFileSync(filename, "utf-8");
            return JSON.parse(data);
        }
    } catch (err) {
        console.error(filename + "の読み込み失敗:", err);
    }
    return []; // ファイルがない、またはエラーなら空の配列を返す
}

function saveData(filename, data) {
    try {
        fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error(filename + "の保存失敗:", err);
    }
}

// 各システムのデータファイル名
const BOOKS_FILE = "./books.json";
const TASKS_FILE = "./tasks.json";
const ITEMS_FILE = "./items.json";

// 起動時にデータを読み込む
let books = loadData(BOOKS_FILE);
let tasks = loadData(TASKS_FILE);
let items = loadData(ITEMS_FILE);

// --- ポータル（ホーム）画面 ---
app.get("/", (req, res) => {
    res.render('home');
});

// ==========================================
// 1. 図書管理 (books)
// ==========================================
app.get("/books", (req, res) => {
    res.render('books_list', { data: books });
});

app.get("/books/:id", (req, res) => {
    const item = books.find(b => b.id == req.params.id);
    res.render('books_detail', { item: item });
});

app.post("/books/add", (req, res) => {
    const newId = books.length > 0 ? books[books.length - 1].id + 1 : 1;
    books.push({ id: newId, title: req.body.title, author: req.body.author });
    saveData(BOOKS_FILE, books); // 保存
    res.redirect('/books');
});

app.get("/books/delete/:id", (req, res) => {
    books = books.filter(b => b.id != req.params.id);
    saveData(BOOKS_FILE, books); // 保存
    res.redirect('/books');
});

// ==========================================
// 2. タスク管理 (tasks)
// ==========================================
app.get("/tasks", (req, res) => {
    res.render('tasks_list', { data: tasks });
});

app.get("/tasks/:id", (req, res) => {
    const item = tasks.find(t => t.id == req.params.id);
    res.render('tasks_detail', { item: item });
});

app.post("/tasks/add", (req, res) => {
    const newId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
    tasks.push({ id: newId, title: req.body.title, limit: req.body.limit });
    saveData(TASKS_FILE, tasks); // 保存
    res.redirect('/tasks');
});

app.get("/tasks/delete/:id", (req, res) => {
    tasks = tasks.filter(t => t.id != req.params.id);
    saveData(TASKS_FILE, tasks); // 保存
    res.redirect('/tasks');
});

// ==========================================
// 3. 商品管理 (items)
// ==========================================
app.get("/items", (req, res) => {
    res.render('items_list', { data: items });
});

app.get("/items/:id", (req, res) => {
    const item = items.find(i => i.id == req.params.id);
    res.render('items_detail', { item: item });
});

app.post("/items/add", (req, res) => {
    const newId = items.length > 0 ? items[items.length - 1].id + 1 : 1;
    items.push({ id: newId, name: req.body.name, price: req.body.price });
    saveData(ITEMS_FILE, items); // 保存
    res.redirect('/items');
});

app.get("/items/delete/:id", (req, res) => {
    items = items.filter(i => i.id != req.params.id);
    saveData(ITEMS_FILE, items); // 保存
    res.redirect('/items');
});

app.listen(8080, () => console.log("Server running at http://localhost:8080"));