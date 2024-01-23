<?php
// Start the session
error_reporting(E_ALL & ~E_NOTICE); // Suppress notices
session_start();

require_once "bootstrap.php";
require_once "database.php";
require_once "SessionRequestHandler.php";

$result = ["studentsData" => null];

// Check if the user is logged in
if (isset($_SESSION["username"])) {
    $majorId = $_GET["majorId"] ?? null;
    $class = $_GET["class"] ?? null;
    $stream = $_GET["stream"] ?? null;
    $administrativeGroup = $_GET["administrativeGroup"] ?? null;

    $sessionHandler = new SessionRequestHandler();
    $userData = $sessionHandler->getAllStudentsByCriteria($majorId, $class, $stream, $administrativeGroup);

    if ($userData) {
        $result["studentsData"] = $userData;
    } else {
        $result["error"] = "No students that match the given criteria.";
    }
} else {
    $result["error"] = "User not logged in";
}

header('Content-Type: application/json');
echo json_encode($result, JSON_UNESCAPED_UNICODE);
?>
