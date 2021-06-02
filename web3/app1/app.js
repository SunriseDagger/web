'use strict';

const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const statusurl = '/status';
const app = express();

const pool = mysql.createPool({
    connectionLimit: 5,
    host: "db",
    user: "mysql",
    password: "Irinka_2000",
    database: "botstate"
});

app.put(statusurl, urlencodedParser, function (req, res) {
    if (!req.headers.id) return res.sendStatus(400);
    const id = req.headers.id;
    const token = req.headers.token;
    const status = req.headers.status;
    const cpuusage = req.headers.cpuusage;
    const config = req.headers.config;
    const configdate = req.headers.configdate;
    pool.query("SELECT 1 FROM status WHERE id = ?", [id])
        .then(result => {
            if (result[0][0] != null) {
                pool.query("update status set token = ?, status = ?, cpuusage = ? where id = ?", [token, status, cpuusage, id])
                    .then(result2 => {
                        res.sendStatus(201);
                    })
                    .catch(err => {
                        res.send(err);
                    });
            }
            else {
                pool.query("INSERT INTO status (id, token, status, cpuusage) VALUES (?,?,?,?)", [id, token, status, cpuusage, config, configdate])
                    .then(result2 => {
                        res.sendStatus(202);
                    })
                    .catch(err => {
                        res.send(err);
                    });
            }
        })
        .catch(err => {
            res.send(err);
        });
});

app.delete(statusurl, function (req, res) {
    const id = req.headers.id;
    pool.query("delete from status where id = ?", [id])
        .then(result => {
            res.send(201);
        })
        .catch(err => {
            res.send(err);
        })
});

app.get(statusurl + '/:id', function (req, res) {
    const id = Number(req.params["id"]);
    pool.query("SELECT * FROM status WHERE id=(?)", [id])
        .then(result => {
            res.send(result[0]);
        })
        .catch(err => {
            res.send(err);
        })
});

app.get(statusurl, function (req, res) {
    pool.query("SELECT * FROM status")
        .then(result => {
            res.send(result[0]);
        })
        .catch(err => {
            res.send(err);
        })
});

//получение списка ботов для обычного пользователя
app.get("/UserIndex", function (req, res) {

    //if(!req.body) return res.sendStatus(400);
    var curr_user = "kutuzova.2018";//req.body.token;

    pool.query("SELECT * FROM botsconf WHERE token =?", [curr_user], function (err, data) {
        if (err) return console.log(err);
        res.send(data);
    });

    //console.log("OOOK");
});

app.get("/AdminIndex", function (req, res) {
    pool.query("SELECT * FROM users", function (err, users_data) {
        if (err) return console.log(err);
        pool.query("SELECT * FROM botsconf", function (err, botsconf_data) {
            if (err) return console.log(err);
            res.send([users_data, botsconf_data]);
        });
    });
    //console.log("OOOK");
});

/*app.post("/deletebot/:id", function (req, res) {

    //const id = req.params.id;
    pool.query("DELETE FROM botsconf WHERE id=?", [id], function (err, data) {
        if (err) return console.log(err);
        res.redirect("/AdminIndex");
    });
});*/

/*app.post("/addbot", urlencodedParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const token = req.body.token;
    const name = req.body.name;
    const status = "off";
    pool.query("INSERT INTO botsconf (token, status, name) VALUES(?, ?, ?)", [token, status, name], function (err, data) {
        if (err) return console.log(err);//err 400 - sendstatus
    });
});*/

app.listen(3002, function () {
    console.log("Server waiting connection...");
});

//------------------------------------------------

