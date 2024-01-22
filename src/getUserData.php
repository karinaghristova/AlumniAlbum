<?php
// Start the session
error_reporting(E_ALL & ~E_NOTICE); // Suppress notices
session_start();

require_once "bootstrap.php";
require_once "database.php";
require_once "SessionRequestHandler.php";

$result = ["userData" => null];

// Check if user is logged in
if (isset($_SESSION["username"])) {
    $targetUsername = $_GET["targetUsername"] ?? null;

    if ($targetUsername) {
        $sessionHandler = new SessionRequestHandler();
        $userData = $sessionHandler->getUserDataByUsername($targetUsername);

        if ($userData) {
            $result["userData"] = $userData;
        } else {
            $result["error"] = "User not found";
        }
    } else {
        $result["error"] = "Target username not provided";
    }
} else {
    $result["error"] = "User not logged in";
}

header('Content-Type: application/json');
echo json_encode($result, JSON_UNESCAPED_UNICODE);
