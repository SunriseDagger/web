CREATE DATABASE IF NOT EXISTS useradmin;

use useradmin;

CREATE TABLE IF NOT EXISTS users
(
idu INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
login VARCHAR(30),
pass VARCHAR(30),
nameu VARCHAR(30),
lastname VARCHAR(30),
patronymics VARCHAR(30),
dateofregistration DATETIME,
datelastconnect DATETIME,
statusu VARCHAR(30)
);

INSERT INTO users (login, pass, nameu, lastname, patronymics, dateofregistration, datelastconnect, statusu)
VALUES
    ('kutuzova.god', 'Irinka', 'Ирина', 'Кутузова', 'Александровна', '2021-04-06 19:00:14', '2021-04-06 19:00:14', 'admin'),
    ('kislin.goose', 'NotPavlin', 'Артем', 'Кислин', 'Викторович', '2021-04-06 19:06:53', '2021-04-06 19:06:53', 'admin');
    
CREATE TABLE IF NOT EXISTS bots
(
idb INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
idbot VARCHAR(30),
nameb VARCHAR(30),
description TEXT,
loginofowner VARCHAR(30),
statusb VARCHAR(30),
dateofbirth DATETIME,
datelastconfigurate DATETIME
);

INSERT INTO bots (idbot, nameb, description, loginofowner, statusb, dateofbirth, datelastconfigurate)
VALUES
    ('Bird1', 'Лазербик', 'Дворецкий Ирины', 'kutuzova.god', 'active', '2021-04-07 15:41:06', '2021-04-07 15:41:06'),
    ('Girl1', 'Кира', 'Следит за твоим распорядком дня', 'kutuzova.god', 'active', '2021-04-07 16:49:15', '2021-04-07 16:49:15');