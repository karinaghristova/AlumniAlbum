function login(event) {
    event.preventDefault();

    const formData = new FormData(document.getElementById("loginForm"));

    fetch("../src/login.php", {
        method: 'POST',
        body: formData
    })
    .then(resp => resp.json())
    .then(resp => {
        console.log("Fetch response:", resp);

        if (resp.result) {
            // Fetch user role
            fetch("../src/getUserRole.php")
                .then(roleResp => roleResp.json())
                .then(roleResp => {
                    console.log("Role response:", roleResp);

                    // Redirect based on user role
                    if (roleResp.role === 1) {
                        window.location.href = '../views/studentProfileBasic.html';
                    } else if (roleResp.role === 2) {
                        window.location.href = '../views/photographerProfileBasic.html';
                    } else {
                        // Default redirection or error handling
                        window.location.href = '../views/defaultProfile.html';
                    }
                })
                .catch(error => {
                    console.error("Error fetching user role:", error);
                });
        } else {
            console.error('Login failed:', resp.error); 
            window.alert('Login failed!');
        }
    })
    .catch(error => {
        console.error("Error during login:", error);
    });
}
