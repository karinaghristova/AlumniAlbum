<?php
require_once "database.php";

function getUserData($id) 
{
    $conn = (new Database())->getConnection();
    $session = $conn->prepare('SELECT * FROM users WHERE username=:id');
    $session->bindValue(':id', $id);
    $session->execute();
    $fetch=$session->fetch(PDO::FETCH_ASSOC);

    return $fetch; 
}
