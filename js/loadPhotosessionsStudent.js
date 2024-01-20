document.addEventListener("DOMContentLoaded", function () {
    loadPhotosessions();
});

function loadPhotosessions() {
    const photosessionsSelect = document.getElementById("photosessions");
    // Fetch all photosessions
    getAllPhotosessions()
        .then(photosessions => {
           
            photosessions.forEach(photosession => {

                const tr = document.createElement("tr");
                const titleTD = document.createElement("td");
                titleTD.textContent = photosession.title;
                const dateTD = document.createElement("td");
                dateTD.textContent = photosession.date;
                const timeTD = document.createElement("td"); 
                timeTD.textContent = photosession.time;
                const statusTD = document.createElement("td");

                var photographerTD = document.createElement("td");
                
                getPhotographer(photosession.photographerUsername)
                    .then(photographer => {
                        photographerTD.textContent = photographer[0].firstName + " " + photographer[0].lastName;
                    })
                    .catch(error => {
                        console.error("Error loading photographer:", error);
                    });
                
                if (photosession.status == 0)
                {
                    statusTD.textContent = "В очакване";
                }
                else if (photosession.status == 1)
                {
                    statusTD.textContent = "Неодобрен";
                }
                else 
                {
                    statusTD.textContent = "Одобрен";
                }

                tr.appendChild(titleTD); 
                tr.appendChild(dateTD);
                tr.appendChild(timeTD);
                tr.appendChild(photographerTD);
                tr.appendChild(statusTD);
                
                photosessionsSelect.appendChild(tr);
            });
        })
        .catch(error => {
            console.error("Error loading photosessions:", error);
        });
}

function getAllPhotosessions() {
    return fetch("../src/getAllPhotosessions.php")
        .then(response => {
            if (!response.ok) {
                throw new Error("Error fetching photosessions");
            }
            return response.json();
        })
        .then(data => data.photosessions)
        .catch(error => {
            console.error("Error fetching photosessions:", error);
            throw error; 
        });
}

function getPhotographer($photographerUsername) {
    var data = new FormData();
    data.append("photographerUsername", $photographerUsername);

    return fetch("../src/getPhotographer.php",
        {
            method: 'POST',
            body: data
        }
    )
    .then(response => {
        if (!response.ok) {
            throw new Error("Error fetching photographer");
        }
        return response.json();
    })
    .then(data => data.photographer)
    .catch(error => {
        console.error("Error fetching photographer:", error);
        throw error; 
    });
}