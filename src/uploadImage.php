<?php

require_once "bootstrap.php";
require_once "database.php";
require_once "SessionRequestHandler.php";

$result = null; 
   
if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) 
{
    $albumId = $_POST['album'];
    $name =  $_FILES['image']['name'];
    $size = $_FILES['image']['size'];
    $data = file_get_contents($_FILES['image']['tmp_name']);

    if ($size < 50000)
    {
        $ex = pathinfo($name, PATHINFO_EXTENSION);
        $str_ex = strtolower($ex);
        $allowed = array("jpg", "jpeg", "png"); 

        if (in_array($str_ex, $allowed)) 
        {
            $sessionHandler = new SessionRequestHandler();
            $result = $sessionHandler->uploadImage($albumId, $name, $data);
        }
        else
        {
            echo "Wrong file format...";
        }
    }
    else
    {
        echo "File too big...";
    }
}

header("Location: ../views/UploadPictures.html");
