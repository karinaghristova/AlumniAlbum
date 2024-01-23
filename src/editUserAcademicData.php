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
    $newMajorId = $_POST["newMajorId"] ?? null;
    $newClass = $_POST["newClass"] ?? null;
    $newStream = $_POST["newStream"] ?? null;
    $newAdministrativeGroup = $_POST["newAdministrativeGroup"] ?? null;

    $username = $_SESSION["username"];

    $sessionHandler = new SessionRequestHandler();

    $success = $sessionHandler->editAcademicInformation($targetUsername, $newMajorId, $newClass, $newStream, $newAdministrativeGroup);

    if ($success) {
        $result["success"] = true;
    } else {
        $result["error"] = "Error editing user academic data";
    }
} else {
    $result["error"] = "User not logged in";
}

header('Content-Type: application/json');
echo json_encode($result, JSON_UNESCAPED_UNICODE);
