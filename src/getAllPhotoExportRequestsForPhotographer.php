<?php
require_once "bootstrap.php";
require_once "database.php";
require_once "SessionRequestHandler.php";


if (isset($_SESSION["username"])){

    $sessionHandler = new SessionRequestHandler();

    $albumExportRequests = $sessionHandler->getAllPhotoExportRequestsForPhotographer($_SESSION["username"]);

    if ($albumExportRequests) {
        $response = ['photoExportInformation' => $albumExportRequests];
    } else {
        $response = ['error' => 'No photo export requests found'];
    }
}
else {
    $result["error"] = "User not logged in";
}


header('Content-Type: application/json');
echo json_encode($response);
