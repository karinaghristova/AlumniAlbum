<?php
error_reporting(E_ALL & ~E_NOTICE); // Suppress notices
session_start();

require_once "bootstrap.php";
require_once "database.php";
require_once "SessionRequestHandler.php";

$result = ["success" => false];

// Check if user is logged in
if (isset($_SESSION["username"])) {
    $targetUsername = $_POST["targetUsername"] ?? null;
    $newMajorId = $_POST["newFirstName"] ?? null;
    $newClass = $_POST["newLastName"] ?? null;
    $newStream = $_POST["newEmail"] ?? null;

    $username = $_SESSION["username"];

    $sessionHandler = new SessionRequestHandler();

    $success = $sessionHandler->editBasicInformation($targetUsername, $newMajorId, $newClass, $newStream);

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
