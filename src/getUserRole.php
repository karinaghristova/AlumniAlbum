<?php
// Start the session
error_reporting(E_ALL & ~E_NOTICE); // Suppress notices
session_start();

require_once "bootstrap.php";
require_once "database.php";
require_once "SessionRequestHandler.php";

$result = ["role" => null];

// Check if user is logged in
if (isset($_SESSION["username"])) {
    $username = $_SESSION["username"];

    $conn = (new Database())->getConnection();
    $selectStatement = $conn->prepare('SELECT role FROM users WHERE username = ?');
    $selectStatement->execute([$username]);

    $user = $selectStatement->fetch();

    $result["role"] = $user ? (int)$user['role'] : null;
} else {
    $result["error"] = "User not logged in";
}

header('Content-Type: application/json');
echo json_encode($result, JSON_UNESCAPED_UNICODE);
