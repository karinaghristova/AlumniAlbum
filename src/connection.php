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
            password VARCHAR(30) NOT NULL,
            email VARCHAR(30) NOT NULL,
            -- admin TINYINT(1) NOT NULL,
            -- firstName VARCHAR(255) NOT NULL,
            -- familyName VARCHAR(255) NOT NULL,
            -- major VARCHAR(8) NOT NULL,
            -- class int NOT NULL,
            -- groupNumber int NOT NULL,
            PRIMARY KEY (username)
        )";
    $connection->exec($sql);

    // Create photos table
    // $sql = "CREATE TABLE photos(
    //     id int NOT NULL AUTO_INCREMENT,
    //     name VARCHAR(255) NOT NULL,
    //     major VARCHAR(64),
    //     class int,
    //     groupNumber int,
    //     occasion VARCHAR(255),
    //     date DATETIME,
    //     user VARCHAR(30),
    //     PRIMARY KEY (id)
    // )";
    // $connection->exec($sql);

    // // Create photo_tag table
    // $sql = "CREATE TABLE photo_tag(
    //     photoId int NOT NULL,
    //     tagId int NOT NULL,
    //     PRIMARY KEY (photoId, tagId)
    // )";
    // $connection->exec($sql);

    // // Create tags table
    // $sql = "CREATE TABLE tags(
    //     id int NOT NULL AUTO_INCREMENT,
    //     text VARCHAR(255) NOT NULL,
    //     PRIMARY KEY (id)
    // )";
    // $connection->exec($sql);

    // // Create badges table
    // $sql = "CREATE TABLE badges(
	// 	assignedUser VARCHAR(30) NOT NULL,
	// 	assigningUser VARCHAR(30) NOT NULL,
	// 	title VARCHAR(30) NOT NULL,
	// 	description VARCHAR(255),
	// 	iconId int NOT NULL,
	// 	PRIMARY KEY (assignedUser, assigningUser, title)
	// )";
    // $connection->exec($sql);

    // // // Add admin
    // $sql = "INSERT INTO users(username, password, email, admin, firstName, familyName, major, class, groupNumber) VALUES 
    //     ('admin', 'admin', 'non-existent@gmail.com', 1, 'Admin', 'Adminov', 'ad', 1992, 1)";
    // $connection->exec($sql);
    $sql = "INSERT INTO users(username, password, email) VALUES 
        ('admin', 'admin', 'admin@gmail.com')";
    $connection->exec($sql);
} 
catch (PDOException $error) {
    echo $error->getMessage();
}