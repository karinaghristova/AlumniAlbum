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
    // Show form or modal
    const newFirstName = prompt("Въведете ново собствено име:", userData.firstName);
    const newLastName = prompt("Въведете ново фамилно:", userData.lastName);
    const newEmail = prompt("Въведете нов имейл:", userData.email);

    // Validate input
    if (newFirstName.trim() === "" || !isString(newFirstName)
        || newLastName.trim() === "" || !isString(newLastName)
        || newEmail.trim() === "" || !isValidEmail(newEmail)) {
        alert("Моля попълнете всички полета!");
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
                location.reload();
            } else {
                alert("Грешка при опит за редактиране на информацията. Опитайте отново.");
            }
        })
        .catch(error => {
            console.error("Грешка при опит за редактиране на информацията:", error);
        });

    location.reload();
}

function handleEditAcademicInformation(userData) {
    // Show form or modal 
    const newMajor = prompt("Въведете нова специалност:", userData.major);
    const newClass = prompt("Въведете нов випуск (година):", userData.class);
    const newStream = prompt("Въведете нов поток (цяло положително число):", userData.stream);
    const newAdministrativeGroup = prompt("Въведете нова група (цяло положително число):", userData.administrativeGroup);

    if (newMajor.trim() === "" || !isString(newMajor)
        || newClass.trim() === "" || !isValidNumber(newClass)
        || newStream.trim() === "" || !isValidNumber(newStream)
        || newAdministrativeGroup.trim() === "" || !isValidNumber(newAdministrativeGroup)) {
        alert("Моля попълнете всички полета!");
        return; // Stop further execution
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
            fetchProfileData();
        })
        .catch(error => {
            console.error("Грешка при опит за редактиране на академичната информация:", error);
        });

    location.reload();
}

// Call the fetchProfileData function when the page loads
document.addEventListener("DOMContentLoaded", fetchProfileData);
