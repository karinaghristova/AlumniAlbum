function login(event) {
    // event.preventDefault();
    const formData = new FormData(document.getElementById("loginForm"));

    console.log(formData);

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
                //TODO: fix redirect
                location.replace("../views/studentProfileBasic.html");
            }
            else {
                console.error('Login failed:', resp.error); 
                window.alert('Error!');
            }
        }).catch(error => console.error('Fetch error:', error));
}; 

