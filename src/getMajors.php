<?php
require_once "bootstrap.php";
require_once "database.php";
require_once "SessionRequestHandler.php";

try {
    $sessionHandler = new SessionRequestHandler();
    $majors = $sessionHandler->getAllMajors();

    if (!$majors) {
        $response = ['error' => 'No majors found'];
    } else {
        $response = ['majors' => $majors];
    }

    header('Content-Type: application/json');
    echo json_encode($response);
} catch (PDOException $e) {
    $error = ['error' => 'Error fetching majors'];
    header('Content-Type: application/json');
    echo json_encode($error);
    error_log($e->getMessage());
}
?>
