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

//Editing basic information
if (isset($_POST["editBasicInfo"])) {
    $newFirstName = $_POST["newFirstName"];
    $newLastName = $_POST["newLastName"];
    $newEmail = $_POST["newEmail"];

    // Update user's information in the DB
    $sessionHandler->editBasicInformation($username, $newFirstName, $newLastName, $newEmail);

    //Return response to the client
    $editResult = ["success" => true];
    echo json_encode($editResult);
    exit;
}

// Additional logic for editing academic information
if (isset($_POST["editAcademicInfo"])) {
    $newMajor = $_POST["newMajor"];
    $newClass = $_POST["newClass"];
    $newStream = $_POST["newStream"];
    $newAdministrativeGroup = $_POST["newAdministrativeGroup"];

    // Update the academic information in the database
    $sessionHandler->editAcademicInformation($username, $newMajor, $newClass, $newStream, $newAdministrativeGroup);

    // Optionally, you can return a response to the client
    $editResult = ["success" => true];
    echo json_encode($editResult);
    exit;
}