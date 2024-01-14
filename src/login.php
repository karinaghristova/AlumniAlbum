<?php 

require_once "bootstrap.php";
require_once "database.php";
require_once "SessionRequestHandler.php";

$result = null;
switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        echo "get";
        $result = (new SessionRequestHandler())->checkLoginStatus();
        break;
    case 'POST':
        echo "post";
        $result = (new SessionRequestHandler())->login($_POST['username'], $_POST['password']);
        break;
    case 'DELETE':
        echo "delete";
        (new SessionRequestHandler())->Logout();
        $result = true;
        break;
    default:
        echo "default";
        $result = false; 
        break;
}

echo json_encode(['result' => $result], JSON_UNESCAPED_UNICODE);

// $_POST = json_decode(file_get_contents("php://input"), true);

// if ($_POST)
// {
//     $userData = json_decode($_POST["user"], true);
//     echo "hello";

//     $db = new Database();
//     $db->registerUser($userData["username"], $userData["password"]);
//     //$db->registerUser($userData);

//     echo json_encode(
//     array(
//         "username" => $userData["username"],
//         "password" => $userData["password"]
//     )
//     );
// }
// else
// {
//     echo "empty...";
// }

// session_start();

// include("connection.php");
// include("help-functions.php");


// function isUserValid($username, $password)
// {
//     $db = new Database();
//     $query = $db->selectUserQuery(["username" => $username, "password" => $password]);

//     if ($query["success"]) {
//         $user = $query["data"]->fetch(PDO::FETCH_ASSOC);
//         if ($user) {
//             return ["success" => true];
//         } else {
//             return ["success" => false, "data" => 'Invalid user'];
//         }
//     } else {
//         return ["success" => false, "data" => $query];
//     }
// }

// // function login()
// // {
//     $errors = [];
//     $response = [];

//     if ($_POST) {
//         $data = json_decode($_POST["data"], true);

//         $username = isset($data["username"]) ? testInput($data["username"]) : "";
//         $password = isset($data["password"]) ? testInput($data["password"]) : "";

//         if (!$username) {
//             $errors[] = "Input username";
//         }

//         if (!$password) {
//             $errors[] = "Input password";
//         }

//         if ($username && $password) {
//             $isValidUser = isUserValid($username, $password);
//             if ($isValidUser["success"]) {
//                 $_SESSION["username"] = $username;
//             } else {
//                 $errors[] = $isValidUser["data"];
//             }
//         }
//     } else {
//         $errors[] = "Invalid request";
//     }

//     if ($errors) {
//         $response = ["success" => false, "error" => $errors];
//     } else {
//         $response = ["success" => true];
//     }

//     echo json_encode($response);
//}

// if($_SERVER['REQUEST_METHOD'] == "POST")
// {
//     //something was posted
//     $username = $_POST['username'];
//     $password = $_POST['password'];

//     if(!empty($username) && !empty($password) && !is_numeric($username))
//     {
//         //read from database
//         $query = "select * from users where username = '$username' limit 1";
//         $result = mysqli_query($con, $query);

//         if($result)
//         {
//             if($result && mysqli_num_rows($result) > 0)
//             {
//                 $user_data = mysqli_fetch_assoc($result);
                
//                 if($user_data['password'] === $password)
//                 {
//                     $_SESSION['user_id'] = $user_data['user_id'];
//                     header("Location: index.php");
//                     die;
//                 }
//             }
//         }
        
//         echo "wrong username or password!";
//     }
//     else
//     {
//         echo "wrong username or password!";
//     }
// }

