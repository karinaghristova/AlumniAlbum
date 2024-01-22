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
            academicInfoBtn.addEventListener("click", () => viewUserAcademicData(user['username'], user['firstName'], user['lastName']));
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

    const editUserFormPopup = document.getElementById("editUserForm");
    editUserFormPopup.style.display = "block";
    const usersTable = document.getElementById("adminUsersContainer");
    usersTable.style.display = "none";

    // Fetch user data for selected user
    fetch(`../src/getUserData.php?targetUsername=${username}`)
        .then(response => response.json())
        .then(data => {
            if (data.userData) {
                const userData = data.userData;
                console.log("userData:", userData);

                // Add current data
                document.getElementById("editFirstName").value = userData.firstName;
                document.getElementById("editLastName").value = userData.lastName;
                document.getElementById("editEmail").value = userData.email;

                // Add event listener for form submission (editing the data)
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

                    // Hide popup
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

function viewUserAcademicData(username, firstName, lastName) {
    // Fetch user academic data for selected user
    fetch(`../src/getUserAcademicData.php?targetUsername=${username}`)
        .then(response => response.json())
        .then(data => {
            if (data.userData) {
                const userAcademicData = data.userData;

                // Add current data
                document.getElementById("studentFullName").textContent = firstName + " " + lastName
                document.getElementById("majorName").textContent = userAcademicData.majorName;
                document.getElementById("class").textContent = userAcademicData.class;
                document.getElementById("stream").textContent = userAcademicData.stream;
                document.getElementById("administrativeGroup").textContent = userAcademicData.administrativeGroup;

                // Show card
                const studentAcademicInfoForm = document.getElementById("studentAcademicInfo");
                studentAcademicInfoForm.style.display = "block";
                const usersTable = document.getElementById("adminUsersContainer");
                usersTable.style.display = "none";

                // Add event listener for the editing button
                const editAcademicBtn = document.getElementById("editAcademicBtn");
                editAcademicBtn.addEventListener("click", () => editUserAcademicData(username, userAcademicData));
            } else {
                console.error("Error fetching user academic data:", data.error);
            }
        })
        .catch(error => {
            console.error("Error fetching user academic data:", error);
        });
}

function editUserAcademicData(username, userData) {
    const studentAcademicInfoForm = document.getElementById("studentAcademicInfo");
    studentAcademicInfoForm.style.display = "none";

    const editAcademicInfoForm = document.getElementById("editAcademicInfo");
    editAcademicInfoForm.style.display = "block";

    // Fetch majors
    fetch("../src/getMajors.php")
        .then(response => response.json())
        .then(data => {
            const majors = data.majors;

            const optionsHTML = majors.map(major => `<option value="${major.id}">${major.majorName}</option>`).join('');

            // Add current data
            document.getElementById("newMajor").innerHTML = optionsHTML;
            document.getElementById("newClass").value = userData.class;
            document.getElementById("newStream").value = userData.stream;
            document.getElementById("newAdministrativeGroup").value = userData.administrativeGroup;

            // Add event listener for form submission
            const editAcademicInfoForm = document.getElementById("editAcademicInfoFormPopup");
            editAcademicInfoForm.addEventListener("submit", function (event) {
                event.preventDefault();

                const newMajorId = document.getElementById("newMajor").value;
                const newClass = document.getElementById("newClass").value;
                const newStream = document.getElementById("newStream").value;
                const newAdministrativeGroup = document.getElementById("newAdministrativeGroup").value;

                // Validate input
                if (newClass.trim() === "" || !isValidNumber(newClass)) {
                    alert("Невалидна стойност за випуск. Моля попълнете всички полета правилно!");
                    return;
                }

                if (newStream.trim() === "" || !isValidNumber(newStream)) {
                    alert("Невалидна стойност за поток. Моля попълнете всички полета правилно!");
                    return;
                }

                if (newAdministrativeGroup.trim() === "" || !isValidNumber(newAdministrativeGroup)) {
                    alert("Невалидна стойност за група. Моля попълнете всички полета правилно!");
                    return;
                }

                // Actual code that edits user academic information
                fetch("../src/editUserAcademicData.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: `targetUsername=${username}&newMajorId=${newMajorId}&newClass=${newClass}&newStream=${newStream}&newAdministrativeGroup=${newAdministrativeGroup}`,
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log("Edit user academic data response:", data);
                        if (data.success) {
                            alert("Академичната информация е успешно редактирана.");
                            location.reload();
                            studentAcademicInfoForm.style.display = "none";
                            editAcademicInfoForm.style.display = "none";
                            
                            fetchAllUsers(); // Reload user data
                        } else {
                            alert("Грешка при опит за редактиране на академичната информация. Опитайте отново.");
                        }
                    })
                    .catch(error => {
                        console.error("Грешка при опит за редактиране на академичната информация:", error);
                    });
            });
        })
        .catch(error => {
            console.error("Грешка при зареждане на специалностите:", error);
        });
}