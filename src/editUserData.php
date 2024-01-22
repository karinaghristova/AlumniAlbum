<?php
// Start the session
error_reporting(E_ALL & ~E_NOTICE); // Suppress notices
session_start();

require_once "bootstrap.php";
require_once "database.php";
require_once "SessionRequestHandler.php";

$result = ["success" => false];

// Check if user is logged in
if (isset($_SESSION["username"])) {
    // Get user input from POST data
    $targetUsername = $_POST["targetUsername"] ?? null;
    $newFirstName = $_POST["newFirstName"] ?? null;
    $newLastName = $_POST["newLastName"] ?? null;
    $newEmail = $_POST["newEmail"] ?? null;


    $username = $_SESSION["username"];

    $sessionHandler = new SessionRequestHandler();

    $success = $sessionHandler->editBasicInformation($targetUsername, $newFirstName, $newLastName, $newEmail);

    if ($success) {
        $result["success"] = true;
    } else {
        $result["error"] = "Error editing user data";
    }
} else {
    $result["error"] = "User not logged in";
}

header('Content-Type: application/json');
echo json_encode($result, JSON_UNESCAPED_UNICODE);
