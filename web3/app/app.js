'use strict';

const mysql = require("mysql2");
const express = require("express");
const bodyParser = require("body-parser");
const http = require('http');
const host = 'app1';

const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
var curr_user;

app.get("/signin", function (req, res) {
    res.render("signin.hbs");
});

app.get("/registration", function (req, res) {
    res.render("registration.hbs");
});

app.get("/addbot", function (req, res) {
    res.render("addbot.hbs");
});

app.get("/addbotUser", function (req, res) {
    res.render("addbotUser.hbs");
});

const pool = mysql.createPool({
    connectionLimit: 5,
    host: "db",
    user: "mysql",
    database: "botstate",
    password: "Irinka_2000"
});

app.set("view engine", "hbs");

// регистрация человека
app.post("/registration", urlencodedParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const login = req.body.login;
    const pass = req.body.pass;
    const admin = false;
    pool.query("INSERT INTO users (login, pass, admin) VALUES (?, ?, ?)", [login, pass, admin], function (err, data) {
        if (err) return console.log(err);
        res.redirect("/signin");
    });
});

// добавление бота
app.post("/addbot", function (req, res) {
    
    if (!req.body) return res.sendStatus(400);
    const data = JSON.stringify(req.body);
    //const status = "off";
    var opt = {
        host: "localhost",
        port: 3002,
        path: "/status",
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        },
    };
    http.request(opt, (res) => {

    });
    let reque = http.request(opt, res => {
        console.log(`statusCode: ${res.statusCode}`)

        res.on('data', d => {
            process.stdout.write(d)
        })
    })

    reque.on('error', error => {
        console.error(error)
    })

    reque.write(data)
    reque.end()

   res.redirect("/AdminIndex");
});

// добавление бота
app.post("/addbot", urlencodedParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const token = req.body.token;
    const name = req.body.name;
    const status = "off";
    pool.query("INSERT INTO botsconf (token, status, name) VALUES(?, ?, ?)", [token, status, name], function (err, data) {
        if (err) return console.log(err);//err 400 - sendstatus
        res.redirect("/AdminIndex");//res.sendstatus(201) - create
    });
});

app.post("/addbotUser", urlencodedParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const token = curr_user;
    const name = req.body.name;
    const status = "off";
    pool.query("INSERT INTO botsconf (token, status, name) VALUES(?, ?, ?)", [token, status, name], function (err, data) {
        if (err) return console.log(err);
        res.redirect("/UserIndex");
    });
});

app.post("/signin", urlencodedParser, function (req, res) {

    
    if (!req.body) return res.sendStatus(400);
    const login = req.body.login;
    const pass = req.body.pass;
    

    pool.query("SELECT * FROM users WHERE login=? AND pass=?", [login, pass], function (err, data) {
        if (err) return console.log(err);
        if (data[0].admin == true) {
            res.redirect("/AdminIndex");
        }
        else {
            curr_user = login;
            res.redirect("/UserIndex");
        }
    });
});

app.post("/signin", urlencodedParser, function (req, res) {


    if (!req.body) return res.sendStatus(400);
    const login = req.body.login;

    if (login == "admin") {
        res.redirect("/AdminIndex");
    }
    else {
        curr_user = login;
        res.redirect("/UserIndex");
    }

});


app.get("/AdminIndex", function (req, res) {

    const data = '';
    const opt = {
        hostname: host,
        port: 3002,
        path: '/AdminIndex',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    }

    let reque = http.request(opt, ress => {
        ress.on('data', d1 => {
            process.stdout.write(d1)
            var users_data = JSON.parse(d1)[0];
            var botsconf_data = JSON.parse(d1)[1];

            res.render("AdminIndex.hbs", {
               users: users_data,
               botsconf: botsconf_data
           });
        })
        console.log(`statusCode: ${ress.statusCode}`)


    })

    reque.on('error', error => {
        console.error(error)
    })

    reque.write(data)
    reque.end()
});

//получение списка ботов для обычного пользователя
app.get("/UserIndex", function (req, res) {

    const data = JSON.stringify("token: " + curr_user);

    const opt = {
        hostname: host,
        port: 3002,
        path: '/UserIndex',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    }

    let reque = http.request(opt, ress => {
        ress.on('data', d => {
            process.stdout.write(d)
            var dat = JSON.parse(d);
            res.render("UserIndex.hbs", {
                botsconf: dat
            });
        })
        console.log(`statusCode: ${ress.statusCode}`)

        
    })

    reque.on('error', error => {
        console.error(error)
    })

    reque.write(data)
    reque.end()
});

// получем id редактируемого пользователя, получаем его из бд и отправлям с формой редактирования
app.get("/edituser/:id", function (req, res) {
    const id = req.params.id;
    pool.query("SELECT * FROM users WHERE id=?", [id], function (err, data) {
        if (err) return console.log(err);
        res.render("edituser.hbs", {
            user: data[0]
        });
    });
});

app.get("/editbot/:id", function (req, res) {
    const id = req.params.id;
    pool.query("SELECT * FROM botsconf WHERE id=?", [id], function (err, data) {
        if (err) return console.log(err);
        res.render("editbot.hbs", {
            user: data[0]
        });
    });
});

app.get("/editbotUser/:id", function (req, res) {
    const id = req.params.id;
    pool.query("SELECT * FROM botsconf WHERE id=?", [id], function (err, data) {
        if (err) return console.log(err);
        res.render("editbotUser.hbs", {
            user: data[0]
        });
    });
});

// получаем отредактированные данные и отправляем их в БД
app.post("/edituser", urlencodedParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);
    const id = req.body.id;
    const login = req.body.login;
    const pass = req.body.pass;
    const admin = req.body.admin ? true : false;

    pool.query("UPDATE users SET login=?, pass=?, admin=? WHERE id=?", [login, pass, admin, id], function (err, data) {
        if (err) return console.log(err);
        res.redirect("/AdminIndex");
    });
});


app.post("/editbot", urlencodedParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);
    const id = req.body.id;
    const name = req.body.name;
    const token = req.body.token;
    const status = req.body.status;

    pool.query("UPDATE botsconf SET token=?, status=?, name=? WHERE id=?", [token, status, name, id], function (err, data) {
        if (err) return console.log(err);
        res.redirect("/AdminIndex");
    });
});

app.post("/editbotUser", urlencodedParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);
    const id = req.body.id;
    const name = req.body.name;
    const status = req.body.status;
    const token = curr_user;

    pool.query("UPDATE botsconf SET name=?, status=?, token=? WHERE id=?", [name, status, token, id], function (err, data) {
        if (err) return console.log(err);
        res.redirect("/UserIndex");
    });
});

// получаем id удаляемого пользователя и удаляем его из бд
app.post("/deleteuser/:id", function (req, res) {

    const id = req.params.id;
    pool.query("DELETE FROM users WHERE id=?", [id], function (err, data) {
        if (err) return console.log(err);
        res.redirect("/AdminIndex");
    });
});

app.post("/deletebot/:id", function (req, res) {

    const id = req.params.id;
    pool.query("DELETE FROM botsconf WHERE id=?", [id], function (err, data) {
        if (err) return console.log(err);
        res.redirect("/AdminIndex");
    });
});

app.post("/deletebot/:id", function (req, res) {

    const data = '';
    const id = req.params.id;

    const opt = {
        hostname: host,
        port: 3002,
        path: "/deletebot/" + req.body.id,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    }

    pool.query("DELETE FROM botsconf WHERE id=?", [id], function (err, data) {
        if (err) return console.log(err);
        res.redirect("/AdminIndex");
    });
});

app.post("/deletebotUser/:id", function (req, res) {

    const id = req.params.id;
    pool.query("DELETE FROM botsconf WHERE id=?", [id], function (err, data) {
        if (err) return console.log(err);
        res.redirect("/UserIndex");
    });
});

app.listen(3003, function () {
    console.log("Сервер ожидает подключения...");
});