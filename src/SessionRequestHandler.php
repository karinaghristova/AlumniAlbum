<?php

class SessionRequestHandler
{

    
    public function checkLoginStatus(): bool
    {
        return isset($_SESSION["username"]);
    }

    public function getUserRole(string $username): ?int
    {
        $conn = (new Database())->getConnection();

        $selectStatement = $conn->prepare('SELECT role FROM users WHERE username = ?');
        $selectStatement->execute([$username]);

        $user = $selectStatement->fetch();

        return $user ? (int)$user['role'] : null;
    }

     public function getUserDataByUsername(string $username): array
    {
        $conn = (new Database())->getConnection();
        $selectStatement = $conn->prepare('SELECT username, firstName, lastName, email, role FROM users WHERE username = ?');
        $selectStatement->execute([$username]);

        return $selectStatement->fetch(PDO::FETCH_ASSOC);
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
    
        $loginSuccessful = ($password === $user["password"]);
    
        if ($loginSuccessful) {
            $_SESSION['username'] = $username;
            $_SESSION['role'] = (int)$user['role'];
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

        $_SESSION = [];
    }

    public function getProfileData(string $username): ?array
    {
        if (!isset($_SESSION)) {
            session_start();
        }
        $conn = (new Database())->getConnection();
        $selectStatement = $conn->prepare('SELECT username, firstName, lastName, email, role FROM users WHERE username = ?');
        $selectStatement->execute([$username]);

        $user = $selectStatement->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            return null; // User not found
        }

        // Additional data based on user role
        if ($user['role'] == 1) {
            // Student profile data
            $selectStatement = $conn->prepare('SELECT major, class, stream, administrativeGroup FROM students WHERE username = ?');
            $selectStatement->execute([$username]);
            $additionalData = $selectStatement->fetch(PDO::FETCH_ASSOC);
        } else {
            $additionalData = []; // Add other roles as needed
        }

        // Merge user data and additional data
        $userData = array_merge($user, $additionalData);

        return $userData;
    }
    
}