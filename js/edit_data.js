function popup(event) {
    let element = document.getElementById("container-hide");
    let hidden = element.getAttribute("hidden");

    if (hidden) {
        element.removeAttribute("hidden");
        document.getElementById("editBtn").disabled = true; 
    } else {
        element.setAttribute("hidden", "hidden");
        document.getElementById("editBtn").disabled = false; 
    }
}

function close(event) {
    let element = document.getElementById("container-hide");
    let hidden = element.getAttribute("hidden");

    if (hidden) {
        element.removeAttribute("hidden");
    } else {
        element.setAttribute("hidden", "hidden");
    }
}

function save(event, $username) {
    event.preventDefault();

    const formData = new FormData(document.getElementById("editForm"));
    formData.append("username", $username);

    fetch("../src/edit.php", {
        method: 'POST',
        body: formData
    })
    .then(resp => resp.json())
    .then(resp => {
        console.log("Fetch response:", resp);
        window.location.href = '../views/studentProfileBasic.php';
        close();
    })
    .catch(error => {
        console.error("Error during editing profile:", error);
    });
}