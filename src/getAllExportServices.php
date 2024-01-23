<?php
require_once "bootstrap.php";
require_once "database.php";
require_once "SessionRequestHandler.php";


if (isset($_SESSION["username"])){
    $sessionHandler = new SessionRequestHandler();

    $photoExportInformation = $sessionHandler->getAllExportServices();

    if ($photoExportInformation) {
        $response = ['exportServices' => $photoExportInformation];
    } else {
        $response = ['error' => 'No export services found'];
    }
}
else {
    $result["error"] = "User not logged in";
}


header('Content-Type: application/json');
echo json_encode($response);
