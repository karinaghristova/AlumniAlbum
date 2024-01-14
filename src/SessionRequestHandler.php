<?php

class SessionRequestHandler
{

    public function checkLoginStatus(): bool
    {
        return isset($_SESSION["username"]);
    }

    public function login(string $username, string $password): bool
    {
        $conn = (new Database())->getConnection();

        $selectStatement = $conn->prepare('SELECT * FROM users WHERE username = ?');
        $selectStatement->execute([$username]);

        $user = $selectStatement->fetch();
        //echo json_encode($user["password"]);
        if (!$user) {
            return false; // user does not exist
        }

        //$loginSuccessful = password_verify($password, $user["password"]);
        //echo password_verify($password, $user["password"]);

        //if ($loginSuccessful) {
            $_SESSION['username'] = $username;
        //}

        //return $loginSuccessful;
        return true; 
    }

    public function register(string $username, string $password, string $email): bool
    {
        $conn = (new Database())->getConnection();

        $selectStatement = $conn->prepare('SELECT * FROM users WHERE username = ?');
        $selectStatement->execute([$username]);

        $user = $selectStatement->fetch();
       
        if (!$user) {
            $insertStatement = $conn->prepare("INSERT INTO users(username, password, email) VALUES ( ? , ?, ? )");
            $insertStatement->execute([$username,$password,$email]);
            return true;
        }
        else {
            return false;
        }
    }

    public function logout()
    {
        session_destroy();
    }
}
