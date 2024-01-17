// myProfile.js

function fetchProfileData() {
    fetch("../src/myProfile.php")
        .then(response => response.json())
        .then(data => {
            console.log("Profile data:", data);

            if (data.userData) {
                const userData = data.userData;

                // Clear existing content
                clearProfileContent();

                // Update user information in the profile container
                updateProfileContent(userData);
            } else {
                console.error("Error fetching profile data:", data.error);
                // Handle the case where there's an error fetching the profile data
            }
        })
        .catch(error => {
            console.error("Error fetching profile data:", error);
            // Handle fetch errors
        });
}

function clearProfileContent() {
    // Clear existing content in the baseInfoContainer
    const baseInfoContainer = document.getElementById("baseInfoContainer");
    baseInfoContainer.innerHTML = "";
}

function updateProfileContent(userData) {
    // Create new elements and append them to the baseInfoContainer
    const baseInfoContainer = document.getElementById("baseInfoContainer");

    // Create a heading
    const heading = document.createElement("h2");
    heading.textContent = "Основна информация";
    baseInfoContainer.appendChild(heading);

    // Create an image container with flip functionality
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
    }  else {
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
    }  else {
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

    // Create <p> elements for each user data field
    createProfileField("Потребителско име:", userData.username, 'username', baseInfoContainer);
    createProfileField("Собствено име:", userData.firstName, 'firstName', baseInfoContainer);
    createProfileField("Фамилно име:", userData.lastName, 'lastName', baseInfoContainer);
    createProfileField("Имейл:", userData.email, 'email', baseInfoContainer);

    if (userData.role === 1) {
        createProfileField("Специалност:", userData.major, 'major', baseInfoContainer);
        createProfileField("Випуск:", userData.class, 'class', baseInfoContainer);
        createProfileField("Поток:", userData.stream, 'stream', baseInfoContainer);
        createProfileField("Група:", userData.administrativeGroup, 'administrativeGroup', baseInfoContainer);
    }

    // Create an "Edit" button
    const editBtn = document.createElement("button");
    editBtn.id = "editBtn";
    editBtn.className = "cardSmallBtn";
    editBtn.name = "editBtn";
    editBtn.textContent = "Редактирай информация";
    baseInfoContainer.appendChild(editBtn);
}

function createProfileField(label, value, valueNameLatin, container) {
    // Create a <p> element for a user data field
    const fieldParagraph = document.createElement("p");
    fieldParagraph.className = "cardField";

    // Create a <span> element for the bold and colored label
    const labelSpan = document.createElement("span");
    labelSpan.className = "bolded";
    labelSpan.textContent = label;

    // Create a <span> element for the value
    const valueSpan = document.createElement("span");
    valueSpan.id = valueNameLatin;
    valueSpan.name = valueNameLatin;
    valueSpan.textContent = value;

    // Append the label and value spans to the field paragraph
    fieldParagraph.appendChild(labelSpan);
    fieldParagraph.appendChild(valueSpan);

    // Append the field paragraph to the specified container
    container.appendChild(fieldParagraph);
}


// Call the fetchProfileData function when the page loads
document.addEventListener("DOMContentLoaded", fetchProfileData);
