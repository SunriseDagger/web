CREATE DATABASE IF NOT EXISTS botstate;

USE botstate;

CREATE TABLE IF NOT EXISTS botsconf
(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    token varchar(20),
    status varchar(20),
    mood varchar(20),
    mode varchar(20),
    name varchar(20)
);

INSERT INTO botsconf (token, status)
VALUES
('kislin.2018', 'ok'),
('kutuzova.2018', 'off');

CREATE TABLE IF NOT EXISTS users
(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    login VARCHAR(20),
    pass VARCHAR(20),
    admin boolean
);

INSERT INTO users (login, pass, admin)
VALUES
('admin', '123', true),
('kislin.2018', 'Pavlin', false),
('kutuzova.2018', 'Irinka', false),
('sopobeda.2018', 'aaa', false);