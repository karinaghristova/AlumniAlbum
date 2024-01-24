<?php
error_reporting(E_ALL & ~E_NOTICE); // Suppress notices
session_start();

require_once "bootstrap.php";
require_once "database.php";
require_once "SessionRequestHandler.php";

$result = ["success" => false];

// Check if user is logged in
if (isset($_SESSION["username"])) {
    $albumId = $_POST["albumId"] ?? null;
    $requestReceiverUsername = $_POST["requestReceiverUsername"] ?? null;

    $username = $_SESSION["username"];

    if($albumId && $requestReceiverUsername){
        $sessionHandler = new SessionRequestHandler();

        $success = $sessionHandler->sendAlbumExportRequest($albumId, $requestReceiverUsername);
    
        if ($success) {
            $result["success"] = true;
        } else {
            $result["error"] = "Error sending photo export request";
        }
    }else{
        $result["error"] = "Invalid or missing argument";
    }

   
} else {
    $result["error"] = "User not logged in";
}

header('Content-Type: application/json');
echo json_encode($result, JSON_UNESCAPED_UNICODE);
