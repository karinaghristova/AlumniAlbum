<?php

require_once "constants.php";

class Database
{
    private $connection;

    public function __construct()
    {
        $dbhost = DBHOST;
        $username = USERNAME;
        $pass = PASS;
        $dbname = DBNAME;

        $this->connection = new PDO("mysql:host={$dbhost};dbname={$dbname}", $username, $pass);
    }

    public function getConnection()
    {
        return $this->connection; 
    }
}