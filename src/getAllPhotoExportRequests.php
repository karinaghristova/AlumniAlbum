<?php
require_once "bootstrap.php";
require_once "database.php";
require_once "SessionRequestHandler.php";


if (isset($_SESSION["username"])){

    $sessionHandler = new SessionRequestHandler();

    if($_SESSION["role"] == 1){
        $photoExportRequests = $sessionHandler->getAllPhotoExportRequestsForStudent($_SESSION["username"]);
    }else{
        $photoExportRequests = $sessionHandler->getAllPhotoExportRequestsForPhotographer($_SESSION["username"]);
    }

    if ($photoExportRequests) {
        $response = ['photoExportRequests' => $photoExportRequests];
    } else {
        $response = ['error' => 'No photo export requests found'];
    }
}
else {
    $result["error"] = "User not logged in";
}


header('Content-Type: application/json');
echo json_encode($response);
