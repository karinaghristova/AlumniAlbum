<?php

class SessionRequestHandler
{

    public function checkLoginStatus(): bool
    {
        return isset($_SESSION["username"]);
    }

    public function login(string $username, string $password): bool
    {
        if (!isset($_SESSION)) {
            session_start();
        }
    
        $conn = (new Database())->getConnection();
    
        $selectStatement = $conn->prepare('SELECT * FROM users WHERE username = ?');
        $selectStatement->execute([$username]);
    
        $user = $selectStatement->fetch();
    
        if (!$user) {
            return false; // User not found
        }
    
        // Compare plain text password
        $loginSuccessful = ($password === $user["password"]);
    
        if ($loginSuccessful) {
            $_SESSION['username'] = $username;
        }
    
        return $loginSuccessful;
    }
    

    public function register(string $username, string $firstName, string $lastName, string $password, string $email, $role): bool
    {
        if (!isset($_SESSION)) {
            session_start();
        }
    
        $conn = (new Database())->getConnection();
    
        $selectStatement = $conn->prepare('SELECT * FROM users WHERE username = ?');
        $selectStatement->execute([$username]);
    
        $user = $selectStatement->fetch();
    
        if (!$user) {
            $insertStatement = $conn->prepare("INSERT INTO users(username, firstName, lastName, password, email, role) VALUES (?, ?, ?, ?, ?, ?)");
            $insertStatement->execute([$username, $firstName, $lastName, $password, $email, $role]);

            //insert into students table
            if($role == 1){
                $insertStatement = $conn->prepare("INSERT INTO students(username) VALUES (?)");
                $insertStatement->execute([$username]);
            }

            return true;
        } else {
            return false;
        }
    }
    
    public function logout()
    {
        if (!isset($_SESSION)) {
            session_start();
        }
        session_destroy();

        // if (!isset($_SESSION)) {
        //     session_start();
        // }

        // // Destroy the session
        // session_destroy();

        // // Unset session variables
        // $_SESSION = [];

        // // Redirect user to login page
        // header('Location: ../views/login.html');
        // exit();
    }

    public function getUserRole(string $username): ?int
{
    $conn = (new Database())->getConnection();

    $selectStatement = $conn->prepare('SELECT role FROM users WHERE username = ?');
    $selectStatement->execute([$username]);

    $user = $selectStatement->fetch();

    return $user ? (int)$user['role'] : null;
}
}
