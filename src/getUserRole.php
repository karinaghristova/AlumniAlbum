<?php
// Start the session
error_reporting(E_ALL & ~E_NOTICE); // Suppress notices
session_start();

require_once "bootstrap.php";
require_once "database.php";
require_once "SessionRequestHandler.php";

// Initialize the result
$result = ["role" => null];

// Check if the user is logged in
if (isset($_SESSION["username"])) {
    $username = $_SESSION["username"];

    // Fetch the user's role
    $conn = (new Database())->getConnection();
    $selectStatement = $conn->prepare('SELECT role FROM users WHERE username = ?');
    $selectStatement->execute([$username]);

    $user = $selectStatement->fetch();

    // Set the result role
    $result["role"] = $user ? (int)$user['role'] : null;
} else {
    // Handle the case where the user is not logged in
    $result["error"] = "User not logged in";
}

// Return the result as JSON
header('Content-Type: application/json');
echo json_encode($result, JSON_UNESCAPED_UNICODE);
