document.addEventListener("DOMContentLoaded", function () {
    loadPhotosessions();
});

function loadPhotosessions() {
    const photosessionsSelect = document.getElementById("photosessions");
    
    getAllPhotosessions()
        .then(photosessions => {
           
            photosessions.forEach(photosession => {

                if (photosession.status == 0)
                {
                    const tr = document.createElement("tr");
                    const titleTD = document.createElement("td");
                    titleTD.textContent = photosession.title;
                    const dateTD = document.createElement("td");
                    dateTD.textContent = photosession.date;
                    const timeTD = document.createElement("td"); 
                    timeTD.textContent = photosession.time;
                    var statusTD = document.createElement("td");
                    var studentTD = document.createElement("td");
                    
                    getStudent(photosession.studentUsername)
                        .then(student => {
                            studentTD.textContent = student[0].firstName + " " + student[0].lastName;
                        })
                        .catch(error => {
                            console.error("Error loading student:", error);
                        });

                    var selecStatus = document.createElement("select");
                    statusTD.appendChild(selecStatus);

                    const option0 = document.createElement("option");
                    option0.value = 0; 
                    option0.textContent = "В очакване"; 
                    selecStatus.appendChild(option0);

                    const option1 = document.createElement("option");
                    option1.value = 1; 
                    option1.textContent = "Не"; 
                    selecStatus.appendChild(option1);
                    
                    const option2 = document.createElement("option");
                    option2.value = 2; 
                    option2.textContent = "Да"; 
                    selecStatus.appendChild(option2);

                    tr.appendChild(titleTD); 
                    tr.appendChild(dateTD);
                    tr.appendChild(timeTD);
                    tr.appendChild(studentTD);
                    tr.appendChild(statusTD);
                    
                    photosessionsSelect.appendChild(tr);
                }

            });
        })
        .catch(error => {
            console.error("Error loading photosessions:", error);
        });
}

function getAllPhotosessions() {
    return fetch("../src/getAllPhotosessionsPhotographer.php")
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

function getStudent($studentUsername) {
    var data = new FormData();
    data.append("studentUsername", $studentUsername);

    return fetch("../src/getStudent.php",
        {
            method: 'POST',
            body: data
        }
    )
    .then(response => {
        if (!response.ok) {
            throw new Error("Error fetching student");
        }
        return response.json();
    })
    .then(data => data.student)
    .catch(error => {
        console.error("Error fetching student:", error);
        throw error; 
    });
}
