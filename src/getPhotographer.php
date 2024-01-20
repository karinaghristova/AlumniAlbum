<?php

require_once "bootstrap.php";
require_once "database.php";
require_once "SessionRequestHandler.php";

$sessionHandler = new SessionRequestHandler();

// Check if the user is authenticated, adjust this based on your authentication logic
if (!$sessionHandler->checkLoginStatus()) {
    http_response_code(401); // Unauthorized
    echo json_encode(['error' => 'Unauthorized access']);
    exit();
}

try {
    $photographer = $sessionHandler->getPhotographer($_POST['photographerUsername']);
    echo json_encode(['photographer' => $photographer]);
} catch (Exception $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(['error' => 'Internal Server Error']);
}

?>