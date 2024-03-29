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

        if (!isset($_SESSION)) {
            session_start();
        }
        
        $conn = (new Database())->getConnection();
        $selectStatement = $conn->prepare('SELECT username, firstName, lastName, email, role FROM users WHERE username = ?');
        $selectStatement->execute([$username]);

        $userData = $selectStatement->fetch(PDO::FETCH_ASSOC);

        if(!$userData){
            return null; // No user data
        }

        return $userData;
    }

    public function getUserAcademicDataByUsername(string $username): array
    {

        if (!isset($_SESSION)) {
            session_start();
        }
        
        $conn = (new Database())->getConnection();
        $selectStatement = $conn->prepare('SELECT s.username, s.majorId, s.class, s.stream, s.administrativeGroup, m.majorName
        FROM students s
        LEFT JOIN majors m ON s.majorId = m.id
        WHERE s.username = ?');
        $selectStatement->execute([$username]);

        $userAcademicData = $selectStatement->fetch(PDO::FETCH_ASSOC);

        if(!$userAcademicData){
            return null; // No user data
        }

        return $userAcademicData;
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

        session_unset();
        $_SESSION = [];

        session_destroy();
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
            return null; // No user
        }

        // Additional data for students
        if ($user['role'] == 1) {
            $selectStatement = $conn->prepare('SELECT u.username, u.firstName, u.lastName, u.email, u.role, s.majorId, s.class, s.stream, s.administrativeGroup, m.majorName
            FROM users u
            LEFT JOIN students s ON u.username = s.username
            LEFT JOIN majors m ON s.majorId = m.id
            WHERE u.username = ?');
            $selectStatement->execute([$username]);
            $additionalData = $selectStatement->fetch(PDO::FETCH_ASSOC);
        } else {
            $additionalData = [];
        }

        // Combine basic info data and additional info data
        $userData = array_merge($user, $additionalData);

        return $userData;
    }

    public function editBasicInformation($username, $newFirstName, $newLastName, $newEmail) 
    {
        if (!isset($_SESSION)) {
            session_start();
        }
        $conn = (new Database())->getConnection();

        $updateStatement = $conn->prepare('UPDATE users SET firstName = ?, lastName = ?, email = ? WHERE username = ?');
        $updateStatement->execute([$newFirstName, $newLastName, $newEmail, $username]);

        return true;
    }
    
    public function editAcademicInformation($username, $newMajorId, $newClass, $newStream, $newAdministrativeGroup) 
    {
        if (!isset($_SESSION)) {
            session_start();
        }
        $conn = (new Database())->getConnection();

        $updateStatement = $conn->prepare('UPDATE students SET majorId = ?, class = ?, stream = ?, administrativeGroup = ? WHERE username = ?');
        $updateStatement->execute([$newMajorId, $newClass, $newStream, $newAdministrativeGroup, $username]);

        return true;
    }

    public function getAllMajors(): ?array
    {
        if (!isset($_SESSION)) {
            session_start();
        }
    
        $conn = (new Database())->getConnection();
    
        $selectStatement = $conn->prepare('SELECT id, majorName FROM majors');
        $selectStatement->execute();
    
        $majors = $selectStatement->fetchAll(PDO::FETCH_ASSOC);
    
        if (!$majors) {
            return null; // No majors
        }
    
        return $majors;
    }

    public function getAllAlbums(): ?array
    {
        if (!isset($_SESSION)) {
            session_start();
        }
    
        $conn = (new Database())->getConnection();
    
        $selectStatement = $conn->prepare('SELECT id, title, ownerUsername, privacy FROM albums');
        $selectStatement->execute();
    
        $albums = $selectStatement->fetchAll(PDO::FETCH_ASSOC);
    
        if (!$albums) {
            return null; // No albums
        }
    
        return $albums;
    }

    public function getOnlyPublicAlbums(): ?array
    {
        if (!isset($_SESSION)) {
            session_start();
        }
    
        $conn = (new Database())->getConnection();
    
        $selectStatement = $conn->prepare('SELECT id, title, ownerUsername, privacy FROM albums WHERE privacy = 1');
        $selectStatement->execute();
    
        $albums = $selectStatement->fetchAll(PDO::FETCH_ASSOC);
    
        if (!$albums) {
            return null; // No albums
        }
    
        return $albums;
    }

    public function getOwnerAlbums($ownerUsername): ?array
    {
        if (!isset($_SESSION)) {
            session_start();
        }
    
        $conn = (new Database())->getConnection();
    
        $selectStatement = $conn->prepare('SELECT id, title, ownerUsername, privacy FROM albums where ownerUsername = ?');
        $selectStatement->execute([$ownerUsername]);
    
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

    public function getAllImages(): ?array
    {
        if (!isset($_SESSION)) {
            session_start();
        }

        $conn = (new Database())->getConnection();

        $selectStatement = $conn->prepare('SELECT id, albumId, name, data FROM photos');
        $selectStatement->execute();

        $photos = $selectStatement->fetchAll(PDO::FETCH_ASSOC);

        if (!$photos) {
            return null; // No photos
        }

        foreach ($photos as &$photo) {
            $photo['data'] = base64_encode($photo['data']);
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
    
        $selectStatement = $conn->prepare('SELECT id, title, photographerUsername, date, time, status FROM photosessions WHERE studentUsername = ?');
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
    
        $selectStatement = $conn->prepare('SELECT id, title, studentUsername, date, time, status FROM photosessions WHERE photographerUsername = ?');
        $selectStatement->execute([$photographerUsername]);
    
        $photosessions = $selectStatement->fetchAll(PDO::FETCH_ASSOC);
    
        if (!$photosessions) {
            return null; // No photosessions
        }
    
        return $photosessions;
    }
    
    public function uploadImage($albumId, $name, $data): bool
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

    public function displayImage($id): bool
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

    public function requestPhotosession($title, $studentUsername, $photographerUsername, $date, $time, $status): bool
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

    public function editPhotosession($status, $id): bool
    {
        if (!isset($_SESSION)) {
            session_start();
        }
        $conn = (new Database())->getConnection();

        $updateStatement = $conn->prepare('UPDATE photosessions SET status = ? WHERE id = ?');
        $updateStatement->execute([$status, $id]);
        $approval = $updateStatement->fetch();

        return true; 
    }

    public function createAlbum($title, $ownerUsername, $privacy): bool
    {
        if (!isset($_SESSION)) {
            session_start();
        }
        $conn = (new Database())->getConnection();

        $insertStatement = $conn->prepare("INSERT INTO albums(title, ownerUsername, privacy) VALUES (?, ?, ?)");
        $insertStatement->execute([$title, $ownerUsername, $privacy]);
        $user = $insertStatement->fetch();

        return true; 
    }

    public function getAllRegularUsers(): ?array
    {
        if (!isset($_SESSION)) {
            session_start();
        }
    
        $conn = (new Database())->getConnection();
    
        $selectStatement = $conn->prepare('
        SELECT u.username, u.firstName, u.lastName, u.password, u.email, u.role, s.majorId, s.class, s.stream, s.administrativeGroup, m.majorName
        FROM users u
        LEFT JOIN students s ON u.username = s.username
        LEFT JOIN majors m ON s.majorId = m.id
        WHERE u.role != 0
    ');
        $selectStatement->execute();
    
        $regularUsers = $selectStatement->fetchAll(PDO::FETCH_ASSOC);
    
        if (!$regularUsers) {
            return null; // No regular users
        }
    
        return $regularUsers;
    }

    public function getAllStudentsByCriteria($majorId, $class, $stream, $administrativeGroup): ?array
    {
        if (!isset($_SESSION)) {
            session_start();
        }
    
        $conn = (new Database())->getConnection();
    
        $query = 'SELECT u.username, u.firstName, u.lastName, s.majorId, s.class, s.stream, s.administrativeGroup, m.majorName
            FROM users u
            LEFT JOIN students s ON u.username = s.username
            LEFT JOIN majors m ON s.majorId = m.id
            WHERE u.role = 1';
    

        $filters = [];
    
        // Filters should only be applied if value is not 0 
        // If value of filter is 0 we should get all possible values of the filter
        if ($majorId != 0) {
            $filters[] = 's.majorId = ?';
        }
        if ($class != 0) {
            $filters[] = 's.class = ?';
        }
        if ($stream != 0) {
            $filters[] = 's.stream = ?';
        }
        if ($administrativeGroup != 0) {
            $filters[] = 's.administrativeGroup = ?';
        }
    
        if (!empty($filters)) {
            $query .= ' AND ' . implode(' AND ', $filters);
        }
    
        $selectStatement = $conn->prepare($query);
    
        // Filter students according to the given criteria
        $params = [];
        if ($majorId != 0) {
            $params[] = $majorId;
        }
        if ($class != 0) {
            $params[] = $class;
        }
        if ($stream != 0) {
            $params[] = $stream;
        }
        if ($administrativeGroup != 0) {
            $params[] = $administrativeGroup;
        }
    
        $selectStatement->execute($params);
    
        $filteredStudents = $selectStatement->fetchAll(PDO::FETCH_ASSOC);
    
        if (!$filteredStudents) {
            return null; // No students that meet the criteria
        }
    
        return $filteredStudents;
    }

    public function getAllExportServices(): ?array
    {
        if (!isset($_SESSION)) {
            session_start();
        }
    
        $conn = (new Database())->getConnection();
    
        $selectStatement = $conn->prepare('SELECT id, serviceName FROM exportServices');
        $selectStatement->execute();
    
        $exportServices = $selectStatement->fetchAll(PDO::FETCH_ASSOC);
    
        if (!$exportServices) {
            return null; // No export serices
        }
    
        return $exportServices;
    }

    public function sendPhotoExportRequest($photoId, $exportServiceId, $requestReceiverUsername, $photoExportCount): bool
    {
        if (!isset($_SESSION)) {
            session_start();
        }
    
        $conn = (new Database())->getConnection();
        $insertStatement = $conn->prepare("INSERT INTO photoExportRequests(photoId, exportServiceId, count, requestSenderUsername, requestReceiverUsername)
        VALUES (?, ?, ?, ?, ?)");
        $insertStatement->execute([$photoId, $exportServiceId, $photoExportCount, $_SESSION['username'], $requestReceiverUsername]);
    
        return true;
    }

    public function sendAlbumExportRequest($albumId, $requestReceiverUsername, $albumExportCount): bool
    {
        if (!isset($_SESSION)) {
            session_start();
        }
    
        $conn = (new Database())->getConnection();
        $insertStatement = $conn->prepare("INSERT INTO albumExportRequests(albumId, count, requestSenderUsername, requestReceiverUsername)
        VALUES (?, ?, ?, ?)");
        $insertStatement->execute([$albumId, $albumExportCount, $_SESSION['username'], $requestReceiverUsername]);
    
        return true;
    }

    public function getAllPhotoExportRequestsForPhotographer($photographer): ?array
    {
        if (!isset($_SESSION)) {
            session_start();
        }
    
        $conn = (new Database())->getConnection();
    
        $selectStatement = $conn->prepare('SELECT per.id, per.photoId, p.Name AS photoName, p.data AS photoData, per.exportServiceId, per.count, per.requestSenderUsername, per.requestReceiverUsername, es.serviceName, u.firstName AS senderFirstName, u.lastName AS senderLastName
        FROM photoExportRequests per
        INNER JOIN exportServices es ON per.exportServiceId = es.id
        INNER JOIN users u ON per.requestSenderUsername = u.username
        INNER JOIN photos p ON per.photoId = p.id
        WHERE per.requestReceiverUsername = ?');
        $selectStatement->execute([$photographer]);
    
        $photoExportRequests = $selectStatement->fetchAll(PDO::FETCH_ASSOC);
    
        if (!$photoExportRequests) {
            return null; // No photo export requests for photographer
        }

        foreach ($photoExportRequests as &$photoExporRequest) {
            $photoExporRequest['photoData'] = base64_encode($photoExporRequest['photoData']);
        }
    
        return $photoExportRequests;
    }

    public function getAllAlbumExportRequestsForPhotographer($photographer): ?array
    {
        if (!isset($_SESSION)) {
            session_start();
        }
    
        $conn = (new Database())->getConnection();
    
        $selectStatement = $conn->prepare('SELECT aer.id, aer.albumId, aer.count, aer.requestSenderUsername, aer.requestReceiverUsername, a.title AS albumTitle, u.firstName AS senderFirstName, u.lastName AS senderLastName
        FROM albumExportRequests aer
        INNER JOIN albums a ON aer.albumId = a.id
        INNER JOIN users u ON aer.requestSenderUsername = u.username
        WHERE aer.requestReceiverUsername = ?');
        $selectStatement->execute([$photographer]);
    
        $albumExportRequests = $selectStatement->fetchAll(PDO::FETCH_ASSOC);
    
        if (!$albumExportRequests) {
            return null; // No album export requests for photographer
        }
    
        return $albumExportRequests;
    }
    
    public function getAllPhotoExportRequestsForStudent($student): ?array
    {
        if (!isset($_SESSION)) {
            session_start();
        }
    
        $conn = (new Database())->getConnection();
    
        $selectStatement = $conn->prepare('SELECT per.id, per.photoId, p.Name AS photoName, p.data AS photoData, per.exportServiceId, per.count, per.requestSenderUsername, per.requestReceiverUsername, es.serviceName, u.firstName AS receiverFirstName, u.lastName AS receiverLastName
        FROM photoExportRequests per
        INNER JOIN exportServices es ON per.exportServiceId = es.id
        INNER JOIN users u ON per.requestReceiverUsername = u.username
        INNER JOIN photos p ON per.photoId = p.id
        WHERE per.requestSenderUsername = ?');
        $selectStatement->execute([$student]);
    
        $photoExportRequests = $selectStatement->fetchAll(PDO::FETCH_ASSOC);
    
        if (!$photoExportRequests) {
            return null; // No photo export requests for student
        }

        foreach ($photoExportRequests as &$photoExporRequest) {
            $photoExporRequest['photoData'] = base64_encode($photoExporRequest['photoData']);
        }
    
        return $photoExportRequests;
    }

    public function getAllAlbumExportRequestsForStudent($student): ?array
    {
        if (!isset($_SESSION)) {
            session_start();
        }
    
        $conn = (new Database())->getConnection();
    
        $selectStatement = $conn->prepare('SELECT aer.id, aer.albumId, aer.count, aer.requestSenderUsername, aer.requestReceiverUsername, a.title AS albumTitle, u.firstName AS receiverFirstName, u.lastName AS receiverLastName
        FROM albumExportRequests aer
        INNER JOIN albums a ON aer.albumId = a.id
        INNER JOIN users u ON aer.requestReceiverUsername = u.username
        WHERE aer.requestSenderUsername = ?');
        $selectStatement->execute([$student]);
    
        $albumExportRequests = $selectStatement->fetchAll(PDO::FETCH_ASSOC);
    
        if (!$albumExportRequests) {
            return null; // No album export requests for student
        }
    
        return $albumExportRequests;
    }

}