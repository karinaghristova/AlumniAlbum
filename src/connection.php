<?php

require_once "constants.php";

try {
	$dbhost = DBHOST;
    $username = USERNAME;
    $pass = PASS;
    $dbname = DBNAME;
    
    // Create database
    $connection = new PDO("mysql:host=$dbhost", $username, $pass);

    $sql = "CREATE DATABASE IF NOT EXISTS $dbname";
    $connection->exec($sql);

    $connection = new PDO(
        "mysql:host=$dbhost;dbname=$dbname",
        $username,
        $pass,
        array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8")
    );

    // Create users table
    $sql = "CREATE TABLE users(
        username VARCHAR(30) NOT NULL,
        firstName VARCHAR(30) NOT NULL,
        lastName VARCHAR(30) NOT NULL, 
        password VARCHAR(30) NOT NULL,
        email VARCHAR(30) NOT NULL,
        role INT NOT NULL,
        PRIMARY KEY (username),
        UNIQUE (username)
    )";
    $connection->exec($sql);

    // Create majors table
    $sql = "CREATE TABLE majors(
        id INT,
        majorName VARCHAR(30),
        PRIMARY KEY (id)
    )";
    $connection->exec($sql);
    
     // Create students table
     $sql = "CREATE TABLE students(
        username VARCHAR(30) NOT NULL,
        majorId INT,
        class VARCHAR(30),
        stream VARCHAR(30),
        administrativeGroup VARCHAR(30),
        FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE,
        FOREIGN KEY (majorId) REFERENCES majors(id) ON DELETE SET NULL
    )";
    $connection->exec($sql);

    // //Create photosession table
    $sql = "CREATE TABLE photosessions(
        id INT NOT NULL AUTO_INCREMENT, 
        title VARCHAR(100) NOT NULL,
        studentUsername VARCHAR(30) NOT NULL,
        photographerUsername VARCHAR(30) NOT NULL,
        date DATE NOT NULL,
        time TIME NOT NULL, 
        status INT NOT NULL,
        FOREIGN KEY (studentUsername) REFERENCES students(username) ON DELETE CASCADE,
        FOREIGN KEY (photographerUsername) REFERENCES users(username) ON DELETE CASCADE, 
        PRIMARY KEY (id)
    )";
    $connection->exec($sql);

    // // Create albums table
    $sql = "CREATE TABLE albums(
        id INT NOT NULL AUTO_INCREMENT,
        title VARCHAR(100) NOT NULL,
        ownerUsername VARCHAR(30) NOT NULL,
        privacy TINYINT(1) NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (ownerUsername) REFERENCES users(username) ON DELETE CASCADE
    )";
    $connection->exec($sql);

    // Create photos table
    $sql = "CREATE TABLE photos(
        id INT NOT NULL AUTO_INCREMENT,
        albumId INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        data LONGBLOB NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (albumId) REFERENCES albums(id) ON DELETE CASCADE
    )";
    $connection->exec($sql);

    // Create export services table
    $sql = "CREATE TABLE exportServices(
        id INT NOT NULL AUTO_INCREMENT,
        serviceName VARCHAR(30) NOT NULL,
        PRIMARY KEY (id)
    )";
    $connection->exec($sql);

    // Create photo export requests table
    $sql = "CREATE TABLE photoExportRequests(
        id INT NOT NULL AUTO_INCREMENT,
        photoId INT NOT NULL,
        exportServiceId INT NOT NULL,
        count INT NOT NULL,
        requestSenderUsername VARCHAR(30) NOT NULL,
        requestReceiverUsername VARCHAR(30) NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (photoId) REFERENCES photos(id) ON DELETE CASCADE,
        FOREIGN KEY (exportServiceId) REFERENCES exportServices(id) ON DELETE CASCADE,
        FOREIGN KEY (requestSenderUsername) REFERENCES users(username) ON DELETE CASCADE,
        FOREIGN KEY (requestReceiverUsername) REFERENCES users(username) ON DELETE CASCADE
    )";
    $connection->exec($sql);

    // Create album export requests table
    $sql = "CREATE TABLE albumExportRequests(
        id INT NOT NULL AUTO_INCREMENT,
        albumId INT NOT NULL,
        count INT NOT NULL,
        requestSenderUsername VARCHAR(30) NOT NULL,
        requestReceiverUsername VARCHAR(30) NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (albumId) REFERENCES albums(id) ON DELETE CASCADE,
        FOREIGN KEY (requestSenderUsername) REFERENCES users(username) ON DELETE CASCADE,
        FOREIGN KEY (requestReceiverUsername) REFERENCES users(username) ON DELETE CASCADE
    )";
    $connection->exec($sql);


    // Some initial data

    // Users
    $sql = "INSERT INTO users(username, firstName, lastName, password, email) VALUES 
        ('admin', 'Admin', 'Adminov', 'admin', 'admin@gmail.com')";
    $connection->exec($sql);
    $sql = "INSERT INTO users(username, firstName, lastName, password, email, role) VALUES 
        ('pesho', 'Petar', 'Petrov', '123456', 'pesho@gmail.com', 1)";
    $connection->exec($sql);
    $sql = "INSERT INTO users(username, firstName, lastName, password, email, role) VALUES 
        ('kaloyan', 'Kaloyan', 'Kaloyanov', '123456', 'kaloyan@email.com', 1)";
    $connection->exec($sql);
    $sql = "INSERT INTO users(username, firstName, lastName, password, email, role) VALUES 
        ('anton', 'Anton', 'Antonov', '123456', 'anton@email.com', 2)";
    $connection->exec($sql);
    $sql = "INSERT INTO users(username, firstName, lastName, password, email, role) VALUES 
        ('sasho', 'Aleksandar', 'Aleksandrov', '123456', 'sasho@email.com', 2)";
    $connection->exec($sql);

    // Majors
    $sql = "INSERT INTO majors(id, majorName) VALUES (1, 'Информатика')";
    $connection->exec($sql);
    $sql = "INSERT INTO majors(id, majorName) VALUES (2, 'Компютърни науки')";
    $connection->exec($sql);
    $sql = "INSERT INTO majors(id, majorName) VALUES (3, 'Софтуерно инженерство')";
    $connection->exec($sql);
    $sql = "INSERT INTO majors(id, majorName) VALUES (4, 'Математика')";
    $connection->exec($sql);
    $sql = "INSERT INTO majors(id, majorName) VALUES (5, 'Приложна математика')";
    $connection->exec($sql);

    // Students
    $sql = "INSERT INTO students(username, majorId, class, stream, administrativeGroup) VALUES 
        ('pesho', 1, 2024, 1, 1)";
    $connection->exec($sql);
    $sql = "INSERT INTO students(username, majorId, class, stream, administrativeGroup) VALUES 
        ('kaloyan', 2, 2023, 2, 1)";
    $connection->exec($sql);

    // Albums
    $sql = "INSERT INTO albums(id, title, ownerUsername, privacy) VALUES 
        ('1', 'TestAlbumPublic', 'pesho', 1)";
    $connection->exec($sql);
    $sql = "INSERT INTO albums(id, title, ownerUsername, privacy) VALUES 
        ('2', 'TestAlbumPrivate', 'anton', 0)";
    $connection->exec($sql);
    $sql = "INSERT INTO albums(id, title, ownerUsername, privacy) VALUES 
        ('3', 'TestAlbumPrivate2', 'pesho', 0)";
    $connection->exec($sql);

    // Photosessions
    $sql = "INSERT INTO photosessions(title, studentUsername, photographerUsername, date, time, status) VALUES 
        ('TestPhotosession', 'pesho', 'anton', '2024-01-25', '12-12', 0)";
    $connection->exec($sql);
    $sql = "INSERT INTO photosessions(title, studentUsername, photographerUsername, date, time, status) VALUES 
        ('ApprovedPhotosession', 'pesho', 'anton', '2024-01-20', '12-12', 2)";
    $connection->exec($sql);
    $sql = "INSERT INTO photosessions(title, studentUsername, photographerUsername, date, time, status) VALUES 
        ('DeclinedPhotosession', 'kaloyan', 'anton', '2024-02-10', '13-15', 1)";
    $connection->exec($sql);
    $sql = "INSERT INTO photosessions(title, studentUsername, photographerUsername, date, time, status) VALUES 
        ('ApprovedPhotosession2', 'kaloyan', 'sasho', '2024-02-10', '13-15', 2)";
    $connection->exec($sql);
    $sql = "INSERT INTO photosessions(title, studentUsername, photographerUsername, date, time, status) VALUES 
        ('TestPhotosession2', 'pesho', 'sasho', '2024-02-15', '14-08', 0)";
    $connection->exec($sql);

    // Export services
    $sql = "INSERT INTO exportServices(id, serviceName) VALUES 
    ('1', 'Снимка')";
    $connection->exec($sql);
    $sql = "INSERT INTO exportServices(id, serviceName) VALUES 
    ('2', 'Картичка')";
    $connection->exec($sql);
    $sql = "INSERT INTO exportServices(id, serviceName) VALUES 
    ('3', 'Календар')";
    $connection->exec($sql);
    $sql = "INSERT INTO exportServices(id, serviceName) VALUES 
    ('4', 'Чаша')";
    $connection->exec($sql);

} 
catch (PDOException $error) {
    echo $error->getMessage();
}