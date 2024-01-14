const button =  document.getElementById("loginBtn");

function login() {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    //console.log("username: ", username, " password: ", password);
    const formData = new FormData(document.getElementById("loginForm"));

    fetch("../src/login.php",
        {
            method: 'POST',
            //body: JSON.stringify({ username: username, password: password }),
            body: formData, 
            //headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' }
        }
    )
    .then(response => {
        return response.json();
    })
    .then((data) => {
        console.log("Fetch response:", data.result);

        if (data.result) {
            window.location.href = "../views/myProfile.html";
        } 
        else {
            window.alert('Error with login!');
        }
    });

}

button.addEventListener("submit", login);

// const ajax = (url, settings, successCallback, errorCallback) => {
//     fetch(url, settings)
//         .then(response => {
//             return response.json();
//         })
//         .then(data => {
//             if (!data.success) {
//                 return errorCallback(data.error);
//             }
//             return successCallback(data.data);
//         })
//         .catch(error => {
//             console.log(error);
//         });
// }

// function login() {
//     var username = document.getElementById('username').value;
//     var password = document.getElementById('password').value;

//     const user = {
//         username,
//         password
//     };

//     const settings = {
//         method: 'POST',
//         headers: {
//             'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
//         },
//         body: `data=${JSON.stringify(user)}`
//     };

//     ajax(
//         '../src/login.php', 
//         settings, 
//         function (data) {
//             window.location.href = 'views/myProfile.html';
//         }, 
//         function (error) {
//             alert(error);
//         }
//     );
// }