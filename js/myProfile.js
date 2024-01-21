// myProfile.js

function fetchProfileData() {
    fetch("../src/myProfile.php")
        .then(response => response.json())
        .then(data => {
            console.log("Profile data:", data);

            if (data.userData) {
                const userData = data.userData;

                clearProfileContent();
                updateProfileContent(userData);
            } else {
                console.error("Error fetching profile data:", data.error);
            }
        })
        .catch(error => {
            console.error("Error fetching profile data:", error);
        });
}

// Clear existing content
function clearProfileContent() {
    const baseInfoContainer = document.getElementById("baseInfoContainer");
    baseInfoContainer.innerHTML = "";
}

// Create new elements for the container
function updateProfileContent(userData) {
    const baseInfoContainer = document.getElementById("baseInfoContainer");

    const heading = document.createElement("h2");
    heading.textContent = "Основна информация";
    baseInfoContainer.appendChild(heading);

    // Flipping image start
    const imageContainer = document.createElement("div");
    imageContainer.className = "flip-container";

    const flipper = document.createElement("div");
    flipper.className = "flipper";

    const front = document.createElement("div");
    front.className = "front";
    const frontImage = document.createElement("img");
    if (userData.role === 1) {
        frontImage.src = "../img/femaleAlumni.png";
    } else if (userData.role === 2) {
        frontImage.src = "../img/femalePhotographer.png";
    } else {
        frontImage.src = "../img/femaleAdmin.jpg";
    }
    frontImage.alt = "avatar front image";
    frontImage.className = "cardPhoto";
    front.appendChild(frontImage);

    const back = document.createElement("div");
    back.className = "back";
    const backImage = document.createElement("img");
    if (userData.role === 1) {
        backImage.src = "../img/maleAlumni.png"; // Student role
    } else if (userData.role === 2) {
        backImage.src = "../img/malePhotographer.png";
    } else {
        // Set a default image or handle other roles as needed
        backImage.src = "../img/maleAdmin.jpg";
    }
    backImage.alt = "avatar back image";
    backImage.className = "cardPhoto";
    back.appendChild(backImage);

    flipper.appendChild(front);
    flipper.appendChild(back);
    imageContainer.appendChild(flipper);

    baseInfoContainer.appendChild(imageContainer);
    // Flipping image end

    // Create user data fields
    createProfileFieldParagraphs("Потребителско име:", userData.username, 'username', baseInfoContainer);
    createProfileFieldParagraphs("Собствено име:", userData.firstName, 'firstName', baseInfoContainer);
    createProfileFieldParagraphs("Фамилно име:", userData.lastName, 'lastName', baseInfoContainer);
    createProfileFieldParagraphs("Имейл:", userData.email, 'email', baseInfoContainer);

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.id = "editBtn";
    editBtn.className = "cardSmallBtn";
    editBtn.name = "editBtn";
    editBtn.textContent = "Редактирай основна информация";
    baseInfoContainer.appendChild(editBtn);

    //Add event listener for editing basic profile information
    const editBttn = document.getElementById("editBtn");
    editBttn.addEventListener("click", () => handleEditBasicInformation(userData));

    // Create student academical information fields
    if (userData.role === 1) {
        createProfileFieldParagraphs("Специалност: ", userData.majorName, 'majorName', baseInfoContainer);
        createProfileFieldParagraphs("Випуск: ", userData.class, 'class', baseInfoContainer);
        createProfileFieldParagraphs("Поток: ", userData.stream, 'stream', baseInfoContainer);
        createProfileFieldParagraphs("Група: ", userData.administrativeGroup, 'administrativeGroup', baseInfoContainer);

        // Edit button
        const editAcademicBtn = document.createElement("button");
        editAcademicBtn.id = "editAcademicBtn";
        editAcademicBtn.className = "cardSmallBtn";
        editAcademicBtn.name = "editAcademicBtn";
        editAcademicBtn.textContent = "Редактирай академична информация";
        baseInfoContainer.appendChild(editAcademicBtn);

        //Add event listener for editing academic profile information
        if (userData.role === 1) {
            const editAcademicBtn = document.getElementById("editAcademicBtn");
            editAcademicBtn.addEventListener("click", () => handleEditAcademicInformation(userData));
        }
    }
}

function createProfileFieldParagraphs(infoType, infoValue, valueIdAndName, parentContainer) {
    // Create  user data field
    const fieldParagraph = document.createElement("p");
    fieldParagraph.className = "cardField";

    // Info type
    const labelSpan = document.createElement("span");
    labelSpan.className = "bolded";
    labelSpan.textContent = infoType;

    // Info value
    const valueSpan = document.createElement("span");
    valueSpan.id = valueIdAndName;
    valueSpan.name = valueIdAndName;
    valueSpan.textContent = infoValue;

    // Magic happens here :)
    fieldParagraph.appendChild(labelSpan);
    fieldParagraph.appendChild(valueSpan);
    parentContainer.appendChild(fieldParagraph);
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

function handleEditBasicInformation(userData) {
    // Show popup and hide main card
    const editBasicInfoPopup = document.getElementById("editBasicInfoPopup");
    editBasicInfoPopup.style.display = "block";
    const profileInfoCard = document.getElementById("profileInformationContainer");
    profileInfoCard.style.display = "none";

    // Add current data
    document.getElementById("newFirstName").value = userData.firstName;
    document.getElementById("newLastName").value = userData.lastName;
    document.getElementById("newEmail").value = userData.email;

    // Add event listener for form submission
    const editBasicInfoForm = document.getElementById("editBasicInfoForm");
    editBasicInfoForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const newFirstName = document.getElementById("newFirstName").value;
        const newLastName = document.getElementById("newLastName").value;
        const newEmail = document.getElementById("newEmail").value;

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

        // Actual code that edits basic information
        fetch("../src/myProfile.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `editBasicInfo=true&newFirstName=${newFirstName}&newLastName=${newLastName}&newEmail=${newEmail}`,
        })
            .then(response => response.json())
            .then(data => {
                console.log("Edit basic information response:", data);
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
        editBasicInfoPopup.style.display = "none";
        location.reload();
    });
}

function handleEditAcademicInformation(userData) {
    // Show popup and hide main card
    const editAcademicInfoPopup = document.getElementById("editAcademicInfoPopup");
    editAcademicInfoPopup.style.display = "block";
    const profileInfoCard = document.getElementById("profileInformationContainer");
    profileInfoCard.style.display = "none";

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
            const editAcademicInfoForm = document.getElementById("editAcademicInfoForm");
            editAcademicInfoForm.addEventListener("submit", function (event) {
                event.preventDefault();

                const newMajor = document.getElementById("newMajor").value;
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

                // Actual code that edits academic information
                fetch("../src/myProfile.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: `editAcademicInfo=true&newMajor=${newMajor}&newClass=${newClass}&newStream=${newStream}&newAdministrativeGroup=${newAdministrativeGroup}`,
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log("Edit academic information response:", data);
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
                editAcademicInfoPopup.style.display = "none";
                location.reload();
            });
        })
        .catch(error => {
            console.error("Грешка при зареждане на специалностите:", error);
        });
}



// Call fetchProfileData function on page load
document.addEventListener("DOMContentLoaded", fetchProfileData);
