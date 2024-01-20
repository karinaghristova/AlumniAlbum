<?php

require_once "bootstrap.php";
require_once "database.php";
require_once "SessionRequestHandler.php";

$result = null; 
   
if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) 
{
    $albumId = $_POST['albumName']; 
    $name =  $_FILES['image']['name'];
    $size = $_FILES['image']['size'];
    $data = file_get_contents($_FILES['image']['tmp_name']);

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
                    window.location.href='../views/UploadPicturesStudent.html';
                </script>";
            }
            else
            {
                echo "<script>
                    window.location.href='../views/UploadPicturesStudent.html';
                </script>";
            }
        }
        else
        {
            echo "<script>
                alert('Грешен формат...');
                window.location.href='../views/UploadPicturesStudent.html';
            </script>";
        }
    }
    else
    {
        echo "<script>
                alert('Твърде голям файл...');
                window.location.href='../views/UploadPicturesStudent.html';
            </script>"; 
    }
}
