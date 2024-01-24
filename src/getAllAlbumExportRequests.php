<?php
require_once "bootstrap.php";
require_once "database.php";
require_once "SessionRequestHandler.php";


if (isset($_SESSION["username"])){

    $sessionHandler = new SessionRequestHandler();

    if($_SESSION["role"] == 1){
        $photoExportRequests = $sessionHandler->getAllAlbumExportRequestsForStudent($_SESSION["username"]);
    }else{
        $photoExportRequests = $sessionHandler->getAllAlbumExportRequestsForPhotographer($_SESSION["username"]);
    }

    if ($photoExportRequests) {
        $response = ['albumExportRequests' => $photoExportRequests];
    } else {
        $response = ['error' => 'No photo export requests found'];
    }
}
else {
    $result["error"] = "User not logged in";
}


header('Content-Type: application/json');
echo json_encode($response);
