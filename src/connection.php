<?php

$dbhost = "127.0.0.1";
$username = "root";
$pass = "";
$dbname = "alumni_album";

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


    // //Create photosession table
    // $sql = "CREATE TABLE photosessions(
    //     studentUsername VARCHAR(30) NOT NULL,
    //     photographerUsername VARCHAR(30) NOT NULL,
    //     date DATETIME NOT NULL,
    //     status VARCHAR(30) NOT NULL,
    //     FOREIGN KEY (studentUsername) REFERENCES students(username) ON DELETE CASCADE,
    //     FOREIGN KEY (photographerUsername) REFERENCES photographers(username) ON DELETE CASCADE
    // )";
    // $connection->exec($sql);

    // // Create albums table
    // $sql = "CREATE TABLE albums(
    //     id INT NOT NULL AUTO_INCREMENT,
    //     title VARCHAR(100) NOT NULL,
    //     ownerUsername VARCHAR(30) NOT NULL,
    //      //should probably have some reference to a photosession, so that everyone from the photosession can see it
    //     PRIMARY KEY (id),
    //     FOREIGN KEY (ownerUsername) REFERENCES users(username) ON DELETE CASCADE,
    // )";
    // $connection->exec($sql);

    // // Create photos table
    // $sql = "CREATE TABLE photos(
    //     id INT NOT NULL AUTO_INCREMENT,
    //     albumId INT NOT NULL,
    //     name VARCHAR(255) NOT NULL,
    //     PRIMARY KEY (id),
    //     FOREIGN KEY (albumId) REFERENCES albums(id) ON DELETE CASCADE,
    // )";
    // $connection->exec($sql);


    // // // Add admin
    // $sql = "INSERT INTO users(username, password, email, admin, firstName, familyName, major, class, groupNumber) VALUES 
    //     ('admin', 'admin', 'non-existent@gmail.com', 1, 'Admin', 'Adminov', 'ad', 1992, 1)";
    // $connection->exec($sql);
    $sql = "INSERT INTO users(username, firstName, lastName, password, email) VALUES 
        ('admin', 'Admin', 'Adminov', 'admin', 'admin@gmail.com')";
    $connection->exec($sql);
} 
catch (PDOException $error) {
    echo $error->getMessage();
}