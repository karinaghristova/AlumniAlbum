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
    const headers = ["Потребителско име", "Собствено име", "Фамилия", "Имейл", "Роля", "", ""];
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

        createUserDataTableCol(row, user['username']);
        createUserDataTableCol(row, user['firstName']);
        createUserDataTableCol(row, user['lastName']);
        createUserDataTableCol(row, user['email']);

        if (user['role'] == 1) {
            createUserDataTableCol(row, 'Студент');
            showAcademicButton = true;
        } else {
            createUserDataTableCol(row, 'Фотограф');
        }

        if (showAcademicButton) {
            // Add view academic button for students
            const actionsCell = row.insertCell();
            const academicInfoBtn = document.createElement("button");
            academicInfoBtn.innerHTML = "<i class=\"fa-solid fa-graduation-cap\"></i>";
            academicInfoBtn.classList.add("cardSmallBtn");
            academicInfoBtn.addEventListener("click", () => viewUserAcademicData(user['username']));
            actionsCell.appendChild(academicInfoBtn);
        } else {
            const actionsCell = row.insertCell();
        }

        // Add edit button
        const actionsCell = row.insertCell();
        const editBtn = document.createElement("button");
        editBtn.innerHTML = "<i class=\"fa-solid fa-pen-to-square\"></i>";
        editBtn.classList.add("cardSmallBtn");
        editBtn.addEventListener("click", () => editUserData(user['username']));
        actionsCell.appendChild(editBtn);
    });
}

function createUserDataTableCol(parentElement, value) {
    const cell = document.createElement('td');
    cell.textContent = value;

    parentElement.appendChild(cell);
}

function isString(value) {
    return typeof value === 'string' || value instanceof String;
}

// whole and positive
function isValidNumber(value) {
    return /^\d+$/.test(value) && parseInt(value, 10) > 0;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function editUserData(username) {
    console.log(username)
    // Show popup
    const editUserFormPopup = document.getElementById("editUserForm");
    editUserFormPopup.style.display = "block";
    const usersTable = document.getElementById("adminUsersContainer");
    usersTable.style.display = "none";

    // Fetch user data for the selected user
    fetch(`../src/getUserData.php?targetUsername=${username}`)
        .then(response => response.json())
        .then(data => {
            if (data.userData) {
                const userData = data.userData;
                console.log("userData:", userData);

                // Add current data to the form
                document.getElementById("editFirstName").value = userData.firstName;
                document.getElementById("editLastName").value = userData.lastName;
                document.getElementById("editEmail").value = userData.email;

                // Add event listener for form submission
                const editUserForm = document.getElementById("editUserFormPopup");
                editUserForm.addEventListener("submit", function (event) {
                    event.preventDefault();

                    const newFirstName = document.getElementById("editFirstName").value;
                    const newLastName = document.getElementById("editLastName").value;
                    const newEmail = document.getElementById("editEmail").value;

                    // Validate input
                    if (newFirstName.trim() === "" || !isString(newFirstName)) {
                        alert("Невалидна стойност за собствено име. Моля, попълнете всички полета правилно!");
                        return;
                    }

                    if (newLastName.trim() === "" || !isString(newLastName)) {
                        alert("Невалидна стойност за фамилно име. Моля, попълнете всички полета правилно!");
                        return;
                    }

                    if (newEmail.trim() === "" || !isValidEmail(newEmail)) {
                        alert("Невалидна стойност за имейл. Моля, попълнете всички полета правилно!");
                        return;
                    }

                    // Actual code that edits user information
                    fetch("../src/editUserData.php", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                        body: `editUserInfo=true&targetUsername=${userData.username}&newFirstName=${newFirstName}&newLastName=${newLastName}&newEmail=${newEmail}`,
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log("Edit user information response:", data);
                            if (data.success) {
                                alert("Информацията е успешно редактирана.");
                                location.reload();
                            } else {
                                alert("Грешка при опит за редактиране на информацията. Опитайте отново.");
                            }
                        })
                        .catch(error => {
                            console.error("Грешка при опит за редактиране на информацията:", error);
                        });

                    // Hide popup after submission
                    editUserFormPopup.style.display = "none";
                    location.reload();
                });
            } else {
                console.error("Error fetching user data:", data.error);
            }
        })
        .catch(error => {
            console.error("Error fetching user data:", error);
        });
}

function viewUserAcademicData(username) {
    // TODO: implement (pop-up maybe???)
    console.log("Академична информация за:", username);
}
