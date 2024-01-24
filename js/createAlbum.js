function create(event) {
    event.preventDefault();
    const formData = new FormData(document.getElementById("createForm"));
    
    // console.log("Form Data:", formData);

    fetch("../src/createAlbum.php",
        {
            method: 'POST',
            body: formData
        }
    )
    .then(resp => resp.json())
    .then(resp => {
        console.log("Fetch response:", resp);

        if (resp.result) {
            //location.reload();
            window.alert('Успешно създаден албум');
        }
        else {
            window.alert('Error! Something went wrong');
        }
    })
    .catch(error => {
        console.error("Fetch error:", error);
    });
}