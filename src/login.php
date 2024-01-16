<?php 

require_once "bootstrap.php";
require_once "database.php";
require_once "SessionRequestHandler.php";

$result = null;
switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        // echo "get";
        $result = (new SessionRequestHandler())->checkLoginStatus();
        break;
    case 'POST':
        // echo "post";
        $result = (new SessionRequestHandler())->login($_POST['username'], $_POST['password']);
        break;
    case 'DELETE':
        // echo "delete";
        (new SessionRequestHandler())->Logout();
        $result = true;
        break;
    default:
        // echo "default";
        $result = false; 
        break;
}

echo json_encode(['result' => $result], JSON_UNESCAPED_UNICODE);

