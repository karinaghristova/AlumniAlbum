<?php

require_once "bootstrap.php";
require_once "database.php";
require_once "SessionRequestHandler.php";

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$sessionHandler = new SessionRequestHandler();

// Check if the user is authenticated, adjust this based on your authentication logic
if (!$sessionHandler->checkLoginStatus()) {
    http_response_code(401); // Unauthorized
    echo json_encode(['error' => 'Unauthorized access']);
    exit();
}

try {
    $images = $sessionHandler->getAllImages();
   
    header('Content-Type: application/json');
    echo json_encode(['images' => $images]);
} catch (Exception $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(['error' => 'Internal Server Error']);
}

?>