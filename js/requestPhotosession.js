function request(event) {
    event.preventDefault();
    const formData = new FormData(document.getElementById("requestForm"));
    
    // console.log("Form Data:", formData);

    fetch("../src/requestPhotosession.php",
        {
            method: 'POST',
            body: formData
        }
    )
    .then(resp => resp.json())
    .then(resp => {
        console.log("Fetch response:", resp);

        if (resp.result) {
            window.location.href = '../views/myReservationsStudent.html';
        }
        else {
            window.alert('Error! Something went wrong');
        }
    })
    .catch(error => {
        console.error("Fetch error:", error);
    });
}