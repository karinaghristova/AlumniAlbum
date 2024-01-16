
<?php 
    session_start();
    include '../src/user_profile.php';

    if(isset($_SESSION['username'])) {
        $usersData = getUserData($_SESSION['username']);
    }
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Моят профил</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="../css/style.css">
    <script src="../js/logout.js"></script>
    <script src="../js/edit_data.js"></script>
</head>

<body>
    <div id="navbar" class="nav-menu">
        <!-- Add navigation -->
        <a class="icon" href="studentProfileBasic.html"><i class="fa-solid fa-user"></i> Основна информация</a>
        <a class="icon" href="studentProfileAcademic.html"><i class="fa-solid fa-user-graduate"></i> Академична информация</a>
        <a class="icon logoutIcon" onclick="logout()"><i class="fa-solid fa-right-from-bracket"></i>Изход</a>
        <a href=""></a>
    </div>
    
    <div id="mainContainer">
        <div id="container">
            <div id="profileInformationContainer" class="profileInfoCard">
                <div id="baseInfoContainer">
                    <h2>Основна информация</h2>
                    <!-- TODO: Change photo according to user role -->
                    <div class="flip-container">
                        <div class="flipper">
                            <div class="front">
                                <!-- Front image goes here -->
                                <img src="../img/FemaleAlumni.png" class="cardPhoto" alt="avatar front image">
                            </div>
                            <div class="back">
                                <!-- Back image goes here -->
                                <img src="../img/maleAlumni.png" class="cardPhoto" alt="avatar back image">
                            </div>
                        </div>
                    </div>
                    <!-- <img src="../img/graduateCap.png" class="cardPhoto" alt="avatar"> -->
                    <p class="cardField" id="username" name="username"><span class="bolded">Потребителско име: </span><?php echo $usersData['username'];?></p>
                    <p class="cardField" id="firstName" name="firstName"><span class="bolded">Собствено име: </span><?php echo $usersData['firstName'];?></p>
                    <p class="cardField" id="lastName" name="lastName"><span class="bolded">Фамилно име: </span><?php echo $usersData['lastName'];?></p>
                    <p class="cardField" id="email" name="email"><span class="bolded">Имейл: </span> <?php echo $usersData['email'];?></p>
                    <button id="editBtn" onclick="popup(event)" class="cardSmallBtn" name="editBtn">Редактирай информация</button>
                </div>
            </div>
        </div>
        <script type="text/javascript">
            var x = "<?php echo $usersData['username']?>";
        </script>
        <div id="container-hide" hidden="hidden">
            <div id="profileInformationContainer" class="profileInfoCard">
                <h2>Редакция</h2>
                <form id="editForm" method="POST">
                    <input class="cardInputField" type="text" id="firstName" name="firstName" placeholder="Собствено име" >
                    <input class="cardInputField" type="text" id="lastName" name="lastName" placeholder="Фамилно име" >
                    <input class="cardInputField" type="password" id="password" name="password" placeholder="Парола">
                    <input class="cardInputField" type="email" id="email" name="email" placeholder="Имейл" >
                    <button id="saveBtn" onclick="save(event, x)" class="cardSmallBtn" name="saveBtn">Запази</button>
                    <button id="closeBtn" onclick="close(event)" class="cardSmallBtn" name="closeBtn">Затвори</button>
                </form>
            </div>
        </div>
    </div>

    
</body>

</html>