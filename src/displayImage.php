<?php

require_once "bootstrap.php";
require_once "database.php";
require_once "SessionRequestHandler.php";

$result = null; 

$id = $_GET['imageId'];

$sessionHandler = new SessionRequestHandler();
$result = $sessionHandler->displayImage($id);

header("Content-Type: image/jpeg");
echo $row['data'];

echo json_encode($result, JSON_UNESCAPED_UNICODE);
