
document.addEventListener("DOMContentLoaded", function () {
    loadPhotosessions();
});

function loadPhotosessions() {
    const photosessionsSelect = document.getElementById("photosessions");
    const photosessionsSelect2 = document.getElementById("photosessions2");
            
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
                const idTD = document.createElement("td");
                idTD.textContent = photosession.id; 
                var statusTD = document.createElement("td");
                var status2TD = document.createElement("td");
                var studentTD = document.createElement("td");
                    
                getStudent(photosession.studentUsername)
                    .then(student => {
                        studentTD.textContent = student[0].firstName + " " + student[0].lastName;
                    })
                    .catch(error => {
                        console.error("Error loading student:", error);
                    });

                tr.appendChild(titleTD); 
                tr.appendChild(dateTD);
                tr.appendChild(timeTD);
                tr.appendChild(studentTD);

                if (photosession.status == 0)
                {
                    selecStatus = document.createElement("select");
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

                    tr.appendChild(statusTD);
                    photosessionsSelect.appendChild(tr);
                }
                else
                {
                    if (photosession.status == 1)
                    {
                        status2TD.textContent = "Неодобрен";
                    }
                    else 
                    {
                        status2TD.textContent = "Одобрен";
                    }

                    tr.appendChild(status2TD);       
                    photosessionsSelect2.appendChild(tr);
                }

                tr.appendChild(idTD);
                idTD.style.display = "none";
                
            });
        })
        .catch(error => {
            console.error("Error loading photosessions:", error);
        });
}

function approve() {
    const selects = document.getElementsByTagName('select');
    const photosessions = document.getElementById('photosessions');
    var idList = [];
    var statusList = [];
    var k = 0;

    for (var i = 1, row; row = photosessions.rows[i]; i++) 
    {
        for (var j = 0, col; col = row.cells[j]; j++) 
        {
            if (j == 5)
            {
                idList[k] = col.innerHTML; //id
                k += 1; 
            }
        }  
    }

    k = 0;

    for (var select of selects)
    {
       statusList[k] = select.value;
       k += 1;
    }

    for (var i = 0; i < statusList.length; i++)
    {
        if (statusList[i] != 0)
        {
            fetch("../src/approvePhotosessions.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `id=${idList[i]}&status=${statusList[i]}`
            })
                .then(response => response.json())
                .then(data => {
                    console.log("Approve response:", data);
    
                    location.reload();
                })
                .catch(error => {
                    console.error("Грешка при опит за одoбрение на фотосесии:", error);
                });
        }
    }

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
