'use strict';

const mysql = require("mysql2");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get("/signin", function (req, res) {
    res.render("signin.hbs");
});

app.get("/registration", function (req, res) {
    res.render("registration.hbs");
});

app.get("/addbot", function (req, res) {
    res.render("addbot.hbs");
});

const pool = mysql.createPool({
    connectionLimit: 5,
    host: "db",
    user: "mysql",
    database: "useradmin",
    password: "Irinka_2000"
});

app.set("view engine", "hbs");

// регистрация человека
app.post("/registration", urlencodedParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const login = req.body.login;
    const pass = req.body.pass;
    const nameu = req.body.nameu;
    const lastname = req.body.lastname;
    const patronymics = req.body.patronymics;
    let dateofregistration = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let datelastconnect = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const statusu = "admin";
    pool.query("INSERT INTO users (login, pass, nameu, lastname, patronymics, dateofregistration, datelastconnect, statusu) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [login, pass, nameu, lastname, patronymics, dateofregistration, datelastconnect, statusu], function (err, data) {
        if (err) return console.log(err);
        res.redirect("/signin");
    });
});

// добавление бота
app.post("/addbot", urlencodedParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const idbot = req.body.idbot;
    const nameb = req.body.nameb;
    const loginofowner = req.body.loginofowner;
    const description = req.body.description;
    let dateofbirth = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let datelastconfigurate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const statusb = "active";
    pool.query("INSERT INTO bots (idbot, nameb, description, loginofowner, statusb, dateofbirth, datelastconfigurate) VALUES(?, ?, ?, ?, ?, ?, ?)", [idbot, nameb, description, loginofowner, statusb, dateofbirth, datelastconfigurate], function (err, data) {
        if (err) return console.log(err);
        res.redirect("/index");
    });
});

app.post("/signin", urlencodedParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const login = req.body.login;
    const pass = req.body.pass;
    pool.query("SELECT `pass` FROM `users` WHERE `login`= ?", [login], function (err, data) {
        if (err) return console.log(err);
        res.redirect("/index");
    });
});

app.get("/index", function (req, res) {
    pool.query("SELECT * FROM users", function (err, users_data) {
        if (err) return console.log(err);
        pool.query("SELECT * FROM bots", function (err, bots_data) {
            if (err) return console.log(err);
            res.render("index.hbs", {
                users: users_data,
                bots: bots_data
            });
        });
    });
});

// получем id редактируемого пользователя, получаем его из бд и отправлям с формой редактирования
app.get("/edituser/:idu", function (req, res) {
    const idu = req.params.idu;
    pool.query("SELECT * FROM users WHERE idu=?", [idu], function (err, data) {
        if (err) return console.log(err);
        res.render("edituser.hbs", {
            user: data[0]
        });
    });
});

app.get("/editbot/:idb", function (req, res) {
    const idb = req.params.idb;
    pool.query("SELECT * FROM bots WHERE idb=?", [idb], function (err, data) {
        if (err) return console.log(err);
        res.render("editbot.hbs", {
            user: data[0]
        });
    });
});

// получаем отредактированные данные и отправляем их в БД
app.post("/edituser", urlencodedParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);
    const idu = req.body.idu;
    const login = req.body.login;
    const nameu = req.body.nameu;
    const lastname = req.body.lastname;
    const patronymics = req.body.patronymics;
    const statusu = req.body.statusu;

    pool.query("UPDATE users SET login=?, nameu=?, lastname=?, patronymics=?, statusu=? WHERE idu=?", [login, nameu, lastname, patronymics, statusu, idu], function (err, data) {
        if (err) return console.log(err);
        res.redirect("/index");
    });
});

app.post("/editbot", urlencodedParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);
    const idb = req.body.idb;
    const idbot = req.body.idbot;
    const nameb = req.body.nameb;
    const description = req.body.description;
    const loginofowner = req.body.loginofowner;
    const statusb = req.body.statusb;

    pool.query("UPDATE bots SET idbot=?, nameb=?, description=?, loginofowner=?, statusb=? WHERE idb=?", [idbot, nameb, description, loginofowner, statusb, idb], function (err, data) {
        if (err) return console.log(err);
        res.redirect("/index");
    });
});

// получаем id удаляемого пользователя и удаляем его из бд
app.post("/deleteuser/:idu", function (req, res) {

    const idu = req.params.idu;
    pool.query("DELETE FROM users WHERE idu=?", [idu], function (err, data) {
        if (err) return console.log(err);
        res.redirect("/index");
    });
});

app.post("/deletebot/:idb", function (req, res) {

    const idb = req.params.idb;
    pool.query("DELETE FROM bots WHERE idb=?", [idb], function (err, data) {
        if (err) return console.log(err);
        res.redirect("/index");
    });
});

app.listen(3001, function () {
    console.log("Сервер ожидает подключения...");
});