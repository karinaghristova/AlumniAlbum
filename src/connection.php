<?php

// $dbhost = "127.0.0.1";
// $username = "root";
// $pass = "";
// $dbname = "alumni_album";

// $connection = mysqli_connect($dbhost,$username,$pass,$dbname);
// $sql = "CREATE DATABASE IF NOT EXISTS $dbname";
// //     $connection->exec($sql);

// if(mysqli_connect_errno())
// {
// 	die("failed to connect!");
// }

try {
	$dbhost = "127.0.0.1";
	$username = "root";
	$pass = "";
	$dbname = "alumni_album";

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
    
    // Create students table
    $sql = "CREATE TABLE students(
            username VARCHAR(30) NOT NULL,
            major VARCHAR(30),
            class VARCHAR(30),
            stream VARCHAR(30),
            administrativeGroup VARCHAR(30),
            FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
    )";
    $connection->exec($sql);

    // $sql = "CREATE TABLE photographers(
    //     username VARCHAR(30) NOT NULL,
        
    //     FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
    // )";
    // $connection->exec($sql);

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
        --  //should probably have some reference to a photosession, so that everyone from the photosession can see it
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

    // Students
    $sql = "INSERT INTO students(username, major, class, stream, administrativeGroup) VALUES 
        ('pesho', 'Информатика', 2024, 1, 1)";
    $connection->exec($sql);
    $sql = "INSERT INTO students(username, major, class, stream, administrativeGroup) VALUES 
        ('kaloyan', 'Компютърни науки', 2023, 2, 1)";
    $connection->exec($sql);

    // Photographers
    // $sql = "INSERT INTO photographers(username) VALUES 
    //     ('anton')";
    // $connection->exec($sql);
    // $sql = "INSERT INTO photographers(username) VALUES 
    //     ('sasho')";
    // $connection->exec($sql);

    // Albums
    $sql = "INSERT INTO albums(id, title, ownerUsername) VALUES 
        ('1', 'probaAlbum', 'pesho')";
    $connection->exec($sql);
    $sql = "INSERT INTO albums(id, title, ownerUsername) VALUES 
        ('2', 'TestAlbum', 'anton')";
    $connection->exec($sql);

    // Photosessions
    $sql = "INSERT INTO photosessions(title, studentUsername, photographerUsername, date, time, status) VALUES 
        ('TestPhotosession', 'pesho', 'anton', '2024-01-25', '12-12', 0)";
    $connection->exec($sql);
    $sql = "INSERT INTO photosessions(title, studentUsername, photographerUsername, date, time, status) VALUES 
        ('ApprovedPhotosession', 'pesho', 'anton', '2024-01-20', '12-12', 2)";
    $connection->exec($sql);

} 
catch (PDOException $error) {
    echo $error->getMessage();
}