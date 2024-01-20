document.addEventListener("DOMContentLoaded", function () {
    loadPhotographers();
});

function loadPhotographers() {
    const photographerSelect = document.getElementById("photographer");
    // Fetch all photographers
    getAllPhotographers()
        .then(photographers => {
            photographerSelect.innerHTML = '';
            // Fill select with photographers options
            photographers.forEach(photographer => {
                const option = document.createElement("option");
                option.value = photographer.username; 
                option.textContent = photographer.firstName + " " + photographer.lastName; 
                photographerSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error loading photographers:", error);
        });
}

function getAllPhotographers() {
    return fetch("../src/getAllPhotographers.php")
        .then(response => {
            if (!response.ok) {
                throw new Error("Error fetching photographers");
            }
            return response.json();
        })
        .then(data => data.photographers)
        .catch(error => {
            console.error("Error fetching photographers:", error);
            throw error; 
        });
}