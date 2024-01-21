<?php

require_once "bootstrap.php";
require_once "database.php";
require_once "SessionRequestHandler.php";

session_start();

$result = ["userData" => null];

// Check if user is logged in
if (isset($_SESSION["username"])) {
    $username = $_SESSION["username"];

    $sessionHandler = new SessionRequestHandler();
    $userData = $sessionHandler->getProfileData($username);

    $result["userData"] = $userData;
} else {
    $result["error"] = "User not logged in";
}

ob_clean();
header('Content-Type: application/json');
echo json_encode($result, JSON_UNESCAPED_UNICODE);

// Basic information edit
if (isset($_POST["editBasicInfo"])) {
    $newFirstName = $_POST["newFirstName"];
    $newLastName = $_POST["newLastName"];
    $newEmail = $_POST["newEmail"];

    $sessionHandler->editBasicInformation($username, $newFirstName, $newLastName, $newEmail);

    $editResult = ["success" => true];
    echo json_encode($editResult);
    exit;
}

// Academic information edit
if (isset($_POST["editAcademicInfo"])) {
    $newMajor = $_POST["newMajor"];
    $newClass = $_POST["newClass"];
    $newStream = $_POST["newStream"];
    $newAdministrativeGroup = $_POST["newAdministrativeGroup"];

    $sessionHandler->editAcademicInformation($username, $newMajor, $newClass, $newStream, $newAdministrativeGroup);

    $editResult = ["success" => true];
    echo json_encode($editResult);
    exit;
}