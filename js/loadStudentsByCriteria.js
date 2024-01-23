document.addEventListener("DOMContentLoaded", function () {
    // Load majors on page load
    fetchMajors();

    // Add event listener
    const showUsersByCriteriaForm = document.getElementById("showUsersByCriteriaForm");
    showUsersByCriteriaForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const majorId = document.getElementById("major").value;
        const classValue = document.getElementById("class").value;
        const stream = document.getElementById("stream").value;
        const administrativeGroup = document.getElementById("administrativeGroup").value;

        console.log("Criteria data: major id: " + majorId + " class: " + classValue + " stream: " + stream + " administrative group: " + administrativeGroup)

        // Fetch filtered students
        fetch(`../src/getStudentsByCriteria.php?majorId=${majorId}&class=${classValue}&stream=${stream}&administrativeGroup=${administrativeGroup}`)
            .then(response => response.json())
            .then(data => {
                if (data.studentsData) {
                    const studentsData = data.studentsData;
                    createStudentsTable(studentsData);
                } else {
                    const studentsTable = document.getElementById("studentsTableContainer");
                    studentsTable.style.display = "none";
                    window.alert("Няма студенти, които да отговарят на тези критерии. Опитайте отново.");
               }
            })
            .catch(error => {
                console.error("Error fetching students data:", error);
            });
    });
});

function fetchMajors() {
    // Fetch and fill dropdown
    const majorDropdown = document.getElementById("major");
    fetch("../src/getMajors.php")
        .then(response => response.json())
        .then(data => {
            if (data.majors) {
                const option = document.createElement("option");
                option.value = 0;
                option.text = "Всички";
                majorDropdown.appendChild(option);

                const majors = data.majors;
                majors.forEach(major => {
                    const option = document.createElement("option");
                    option.value = major.id;
                    option.text = major.majorName;
                    majorDropdown.appendChild(option);
                });
            } else {
                console.error("Error fetching majors:", data.error);
            }
        })
        .catch(error => {
            console.error("Error fetching majors:", error);
        });
}

function createStudentsTable(studentsData) {
    const studentsTable = document.getElementById("studentsTable");
    studentsTable.innerHTML = "";

    // Create table header
    const headerRow = studentsTable.insertRow();
    const headers = ["Потребителско име", "Собствено име", "Фамилия", "Специалност", "Випуск", "Поток", "Група"];
    headers.forEach(headerText => {
        const th = document.createElement("th");
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    // Fill table with student data
    studentsData.forEach(student => {
        const row = studentsTable.insertRow();
        const values = [student.username, student.firstName, student.lastName, student.majorName, student.class, student.stream, student.administrativeGroup];
        values.forEach(value => {
            const cell = row.insertCell();
            cell.textContent = value;
        });
    });

    const studentsTableContainer = document.getElementById("studentsTableContainer");
    studentsTableContainer.style.display = "block";
}
