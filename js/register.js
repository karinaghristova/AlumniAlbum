const button =  document.getElementById("registerBtn");

function login() {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    //console.log("username: ", username, " password: ", password);
    const formData = new FormData(document.getElementById("loginForm"));

    fetch("../src/register.php",
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
            window.alert('Error with registration!');
        }
    });

}

button.addEventListener("submit", login);