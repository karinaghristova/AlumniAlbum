function register(event) {
    // event.preventDefault();
    const formData = new FormData(document.getElementById("registerForm"));
    
    // console.log("Form Data:", formData);

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
            //TODO: fix redirect according to user role
            window.location.href = '../views/login.html';
        }
        else {
            window.alert('Error! Something went wrong');
        }
    })
    .catch(error => {
        console.error("Fetch error:", error);
    });
}
