<?php

require_once "bootstrap.php";
require_once "database.php";
require_once "SessionRequestHandler.php";

// Start the session
session_start();

// Initialize the result
$result = ["userData" => null];

// Check if the user is logged in
if (isset($_SESSION["username"])) {
    $username = $_SESSION["username"];

    // Create an instance of SessionRequestHandler
    $sessionHandler = new SessionRequestHandler();

    // Fetch the user's profile data
    $userData = $sessionHandler->getProfileData($username);

    // Set the result data
    $result["userData"] = $userData;
} else {
    // Handle the case where the user is not logged in
    $result["error"] = "User not logged in";
}

// Return the result as JSON
ob_clean();
header('Content-Type: application/json');
echo json_encode($result, JSON_UNESCAPED_UNICODE);
