<?php
namespace models;

use PDO;

class Database
{
    private $connection;

    public function __construct()
    {
        $dbhost = "127.0.0.1";
        $username = "root";
        $pass = "";
        $dbname = "alumni_album";
        $this->connection = new PDO("mysql:host={$dbhost};dbname={$dbname}", $username, $pass);
    }

    public function registerUser($username, $password)
    //public function registerUser($data)
    {
        $sql = "INSERT INTO users(username, password) VALUES ( ? , ? )";
        $stmnt = $this->connection->prepare($sql);
        $stmnt->execute([$username, $password]);
        //$stmnt->execute($data);
    }

    public function selectUser($data)
    {
        $sql = "SELECT * FROM users WHERE username=:username AND password=:password";
        $stmnt = $this->connection->prepare($sql);
        $stmnt->execute($data);
    }

    public function getConnction()
    {
        return $this->connection; 
    }
}