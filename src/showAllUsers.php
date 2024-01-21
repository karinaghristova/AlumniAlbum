<?php

require_once "bootstrap.php";
require_once "database.php";
require_once "SessionRequestHandler.php";

if (!isset($_SESSION)) {
    session_start();
}
$result = ["users" => null];

// Check if user is logged in
if (isset($_SESSION["username"])) {
    $username = $_SESSION["username"];

    $sessionHandler = new SessionRequestHandler();
    $regularUsers = $sessionHandler->getAllRegularUsers();

    $result["users"] = $regularUsers;

} else {
    $result["error"] = "User not logged in";
}

// Return the result as JSON
header('Content-Type: application/json');
echo json_encode($result, JSON_UNESCAPED_UNICODE);
?>
