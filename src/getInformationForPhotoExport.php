<?php
require_once "bootstrap.php";
require_once "database.php";
require_once "SessionRequestHandler.php";


if (isset($_SESSION["username"])){
    $sessionHandler = new SessionRequestHandler();

    $exportServices = $sessionHandler->getAllExportServices();
    $photographers = $sessionHandler->getAllPhotographers();

    if ($exportServices && $photographers) {
        $response['photographers'] = $photographers;
        $response['exportServices'] = $exportServices;
    } else {
        $response = ['error' => 'No photo export information found'];
    }
}
else {
    $result["error"] = "User not logged in";
}


header('Content-Type: application/json');
echo json_encode($response);
