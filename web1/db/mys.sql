CREATE DATABASE IF NOT EXISTS comments;

USE comments;

CREATE TABLE IF NOT EXISTS users
(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(20),
    comment TEXT,
    data DATETIME
);

INSERT INTO users (name, comment, data)
VALUES
    ('Irina', '���� ������! ���� ��� ������ �����!', '2021-04-16 15:28:24'),
    ('Maria', '������!', '2021-04-16 15:28:41'),
    ('Antoshka', '� � �������-�� ������� ��������!', '2021-04-16 15:28:57');

