<?php

require_once "bootstrap.php";
require_once "database.php";
require_once "SessionRequestHandler.php";

$result = null; 

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        $result = (new SessionRequestHandler())->checkLoginStatus();
        break;
    case 'POST':
        $result = (new SessionRequestHandler())->editPhotosession(
            $_POST['status'],
            $_POST['id']
        );
        break;
    case 'DELETE':
        (new SessionRequestHandler())->logout();
        $result = true;
        break;
    default:
        $result = false;
        break;
}

ob_clean();
header('Content-Type: application/json');
echo json_encode(['result' => $result], JSON_UNESCAPED_UNICODE);