function login(event) {
    event.preventDefault();
    const formData = new FormData(document.getElementById("loginForm"));

    fetch("../src/login.php",
        {
            method: 'POST',
            body: formData
        }
    )
        .then(resp => resp.json())
        .then(resp => {
            console.log("Fetch response:", resp);

            if (resp.result) {
                location.replace("../views/myProfile.html");
            }
            else {
                window.alert('Error!');
            }
        });
}; 