document.addEventListener("DOMContentLoaded", fetchAllUsers);

function fetchAllUsers() {
    fetch("../src/showAllUsers.php")
        .then(response => response.json())
        .then(data => {
            console.log("All Users data:", data);

            if (data.users) {
                const users = data.users;
                createUsersTableContent(users);
            } else {
                console.error("Error fetching all users:", data.error);
            }
        })
        .catch(error => {
            console.error("Error fetching all users:", error);
        });
}

function createUsersTableContent(users) {
    const usersTable = document.getElementById("usersTable");

    usersTable.innerHTML = "";

    // Table header
    const tableHeader = usersTable.createTHead();
    const headerRow = tableHeader.insertRow();
    const headers = ["Потребителско име", "Собствено име", "Фамилия", "Парола", "Имейл", "Роля", "", ""];
    headers.forEach(headerText => {
        const th = document.createElement("th");
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    // Table body
    const tableBody = usersTable.createTBody();

    // User data rows
    users.forEach(user => {
        const row = tableBody.insertRow();
        let showAcademicButton = false;

        for (const key in user) {
            if (key == 'role' && user[key] == 1) {
                createStudentDataTableCol(row, 'Студент');
                showAcademicButton = true;
                continue;
            } else if (key == 'role' && user[key] == 2) {
                createStudentDataTableCol(row, 'Фотограф');
                continue;
            }

            createStudentDataTableCol(row, user[key])
        }

        if (showAcademicButton) {
            // Add view academic button for students
            const actionsCell = row.insertCell();
            const viewAcademicInfoButton = document.createElement("button");
            viewAcademicInfoButton.innerHTML = "<i class=\"fa-solid fa-graduation-cap\"></i>";
            viewAcademicInfoButton.classList.add("cardSmallBtn");
            viewAcademicInfoButton.addEventListener("click", () => viewUserAcademicData(user.username));
            actionsCell.appendChild(viewAcademicInfoButton);
        }else{
            const actionsCell = row.insertCell();
        }

        // Add edit button
        const actionsCell = row.insertCell();
        const viewDetailsButton = document.createElement("button");
        viewDetailsButton.innerHTML = "<i class=\"fa-solid fa-pen-to-square\"></i>";
        viewDetailsButton.classList.add("cardSmallBtn");
        viewDetailsButton.addEventListener("click", () => editUserData(user.username));
        actionsCell.appendChild(viewDetailsButton);
    });
}

function createStudentDataTableCol(parentElement, value) {
    const cell = document.createElement('td');
    cell.textContent = value;

    parentElement.appendChild(cell);
}

function editUserData(username) {
    // TODO: add editing
    console.log("Редактиране на информация за:", username);
}

function viewUserAcademicData(username) {
    // TODO: implement (pop-up maybe???)
    console.log("Академична информация за:", username);
}
