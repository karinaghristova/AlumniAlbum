<?php

require_once "bootstrap.php";
require_once "database.php";
require_once "SessionRequestHandler.php";

$result = null; 
$count = count($_FILES['image']['name']);

for($i = 0; $i < $count; $i++)
{
    $albumId = $_POST['albumName']; 
    $name =  $_FILES['image']['name'][$i];
    $size = $_FILES['image']['size'][$i];
    $data = file_get_contents($_FILES['image']['tmp_name'][$i]);

    if ($size < 1000000)
    {
        $ex = pathinfo($name, PATHINFO_EXTENSION);
        $str_ex = strtolower($ex);
        $allowed = array("jpg", "jpeg", "png"); 

        if (in_array($str_ex, $allowed)) 
        {
            $sessionHandler = new SessionRequestHandler();
            $result = $sessionHandler->uploadImage($albumId, $name, $data);

            if (!$result)
            {
                echo "<script>
                    alert('Възникна грешка...');
                    window.location.href='../views/UploadPicturesPhotographer.html';
                </script>";
            }
            else
            {
                echo "<script>
                    window.location.href='../views/UploadPicturesPhotographer.html';
                </script>";
            }
        }
        else
        {
            echo "<script>
                alert('Грешен формат...');
                window.location.href='../views/UploadPicturesPhotographer.html';
            </script>";
        }
    }
    else
    {
        echo "<script>
                alert('Твърде голям файл...');
                window.location.href='../views/UploadPicturesPhotographer.html';
            </script>"; 
    }
}
   