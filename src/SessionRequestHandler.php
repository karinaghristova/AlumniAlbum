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

    public function editBasicInformation($username, $newFirstName, $newLastName, $newEmail) 
    {
        if (!isset($_SESSION)) {
            session_start();
        }
        $conn = (new Database())->getConnection();

        // Update the basic information in the 'users' table
        $updateStatement = $conn->prepare('UPDATE users SET firstName = ?, lastName = ?, email = ? WHERE username = ?');
        $updateStatement->execute([$newFirstName, $newLastName, $newEmail, $username]);

        // If you have additional logic or validation, add it here

        return true; // Success
    }
    
    public function editAcademicInformation($username, $newMajor, $newClass, $newStream, $newAdministrativeGroup) 
    {
        if (!isset($_SESSION)) {
            session_start();
        }
        $conn = (new Database())->getConnection();

        // Update the academic information in the 'students' table
        $updateStatement = $conn->prepare('UPDATE students SET major = ?, class = ?, stream = ?, administrativeGroup = ? WHERE username = ?');
        $updateStatement->execute([$newMajor, $newClass, $newStream, $newAdministrativeGroup, $username]);

        // If you have additional logic or validation, add it here

        return true; // Success
    }

    public function getAllAlbums(): ?array
    {
        if (!isset($_SESSION)) {
            session_start();
        }
    
        $conn = (new Database())->getConnection();
    
        $selectStatement = $conn->prepare('SELECT id, title, ownerUsername FROM albums');
        $selectStatement->execute();
    
        $albums = $selectStatement->fetchAll(PDO::FETCH_ASSOC);
    
        if (!$albums) {
            return null; // No albums
        }
    
        return $albums;
    }

    public function getPhotosInAlbum(int $albumId): ?array
    {
        if (!isset($_SESSION)) {
            session_start();
        }

        $conn = (new Database())->getConnection();

        $selectStatement = $conn->prepare('SELECT id, name FROM photos WHERE albumId = ?');
        $selectStatement->execute([$albumId]);

        $photos = $selectStatement->fetchAll(PDO::FETCH_ASSOC);

        if (!$photos) {
            return null; // No photos
        }

        return $photos;
    }

    public function getAllPhotographers(): ?array
    {
        if (!isset($_SESSION)) {
            session_start();
        }
    
        $conn = (new Database())->getConnection();
    
        $selectStatement = $conn->prepare('SELECT username, firstName, lastName FROM users WHERE role = 2');
        $selectStatement->execute();
    
        $photographers = $selectStatement->fetchAll(PDO::FETCH_ASSOC);
    
        if (!$photographers) {
            return null; // No photographers
        }
    
        return $photographers;
    }

    public function getPhotographer($photographerUsername) 
    {
        if (!isset($_SESSION)) {
            session_start();
        }
    
        $conn = (new Database())->getConnection();
    
        $selectStatement = $conn->prepare('SELECT firstName, lastName FROM users WHERE role = 2 and username = ?');
        $selectStatement->execute([$photographerUsername]);
    
        $photographer = $selectStatement->fetchAll(PDO::FETCH_ASSOC);
    
        if (!$photographer) {
            return null; // No photographers
        }
    
        return $photographer;
    }

    public function getStudent($studentUsername) 
    {
        if (!isset($_SESSION)) {
            session_start();
        }
    
        $conn = (new Database())->getConnection();
    
        $selectStatement = $conn->prepare('SELECT firstName, lastName FROM users WHERE role = 1 and username = ?');
        $selectStatement->execute([$studentUsername]);
    
        $student = $selectStatement->fetchAll(PDO::FETCH_ASSOC);
    
        if (!$student) {
            return null; // No student
        }
    
        return $student;
    }

    public function getAllPhotosessions($studentUsername): ?array
    {
        if (!isset($_SESSION)) {
            session_start();
        }
    
        $conn = (new Database())->getConnection();
    
        $selectStatement = $conn->prepare('SELECT title, photographerUsername, date, time, status FROM photosessions WHERE studentUsername = ?');
        $selectStatement->execute([$studentUsername]);
    
        $photosessions = $selectStatement->fetchAll(PDO::FETCH_ASSOC);
    
        if (!$photosessions) {
            return null; // No photosessions
        }
    
        return $photosessions;
    }

    public function getAllPhotosessionsPhotographer($photographerUsername): ?array
    {
        if (!isset($_SESSION)) {
            session_start();
        }
    
        $conn = (new Database())->getConnection();
    
        $selectStatement = $conn->prepare('SELECT title, studentUsername, date, time, status FROM photosessions WHERE photographerUsername = ?');
        $selectStatement->execute([$photographerUsername]);
    
        $photosessions = $selectStatement->fetchAll(PDO::FETCH_ASSOC);
    
        if (!$photosessions) {
            return null; // No photosessions
        }
    
        return $photosessions;
    }
    
    public function uploadImage($albumId, $name, $data)
    {
        if (!isset($_SESSION)) {
            session_start();
        }
        $conn = (new Database())->getConnection();

        $insertStatement = $conn->prepare("INSERT INTO photos(albumId, name, data) VALUES (?, ?, ?)");
        $insertStatement->execute([$albumId, $name, $data]);
        $user = $insertStatement->fetch();

        return true; 
    }

    public function displayImage($id)
    {
        if (!isset($_SESSION)) {
            session_start();
        }
        $conn = (new Database())->getConnection();

        $selectStatement = $conn->prepare("SELECT name, data FROM photos WHERE id=?");
        $selectStatement->execute([$id]);
        $user = $selectStatement->fetch(PDO::FETCH_ASSOC);

        return true; 
    }

    public function requestPhotosession($title, $studentUsername, $photographerUsername, $date, $time, $status)
    {
        if (!isset($_SESSION)) {
            session_start();
        }
        $conn = (new Database())->getConnection();

        $insertStatement = $conn->prepare("INSERT INTO photosessions(title, studentUsername, photographerUsername, date, time, status) VALUES (?, ?, ?, ?, ?, ?)");
        $insertStatement->execute([$title, $studentUsername, $photographerUsername, $date, $time, $status]);
        $photosession = $insertStatement->fetch();

        return true; 
    }
}