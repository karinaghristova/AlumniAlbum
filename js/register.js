function register() {
    event.preventDefault();
    const formData = new FormData(document.getElementById("loginForm"));

    fetch("../src/register.php",
        {
            method: 'POST',
            body: formData
        }
    )
    .then(resp => resp.json())
    .then(resp => {
        console.log("Fetch response:", resp);

        if (resp.result) {
            //location.replace("../views/myProfile.html");
            window.location.href = '../views/myProfile.html';
        }
        else {
            window.alert('Error!');
        }
    });
}
