document.addEventListener("DOMContentLoaded", function () {
    // Fetch and display photo export requests
    fetchPhotoExportRequests();

    // Fetch and display album export requests
    fetchAlbumExportRequests();
});

// Function to fetch and display photo export requests
function fetchPhotoExportRequests() {
    fetch("../src/getAllPhotoExportRequestsForPhotographer.php")
        .then(response => response.json())
        .then(data => {
            const photoExportRequests = data.photoExportInformation;

            // Display photo export requests in the table
            displayPhotoExportRequests(photoExportRequests);
        })
        .catch(error => {
            console.error("Error fetching photo export requests:", error.message);
        });
}

// Function to fetch and display album export requests
function fetchAlbumExportRequests() {
    fetch("../src/getAllAlbumExportRequestsForPhotographer.php")
        .then(response => response.json())
        .then(data => {
            const albumExportRequests = data.albumExportRequests;

            // Display album export requests in the table
            displayAlbumExportRequests(albumExportRequests);
        })
        .catch(error => {
            console.error("Error fetching album export requests:", error.message);
        });
}

function createChildElement(parentElement, childElementType, textContentValue){
    const childElement = document.createElement(childElementType);
    childElement.textContent = textContentValue;
    parentElement.appendChild(childElement);
}

function displayPhotoExportRequests(photoExportRequests) {
    const photoExportRequestsTable = document.getElementById("photoExportRequestsTable");
    photoExportRequestsTable.innerHTML = "";

    // Create table header
    const tableHeaderRow = document.createElement("tr");
    createChildElement(tableHeaderRow, "th", "ID на снимка");
    createChildElement(tableHeaderRow, "th", "Вид на услугата");
    createChildElement(tableHeaderRow, "th", "Потребителско име на заявителя");
    createChildElement(tableHeaderRow, "th", "Имена на заявителя");

    photoExportRequestsTable.appendChild(tableHeaderRow)

    // Create table rows
    photoExportRequests.forEach(request => {
        const currentRow = document.createElement("tr");
        createChildElement(currentRow, "td", request.photoId);
        createChildElement(currentRow, "td", request.serviceName);
        createChildElement(currentRow, "td", request.requestSenderUsername);
        createChildElement(currentRow, "td", request.senderFirstName + " " + request.senderLastName);
        photoExportRequestsTable.appendChild(currentRow);
    });
}

function displayAlbumExportRequests(albumExportRequests) {
    const albumExportRequestsTable = document.getElementById("albumExportRequestsTable");
    albumExportRequestsTable.innerHTML = "";

    // Create table header
    const tableHeaderRow = document.createElement("tr");
    createChildElement(tableHeaderRow, "th", "ID на албума");
    createChildElement(tableHeaderRow, "th", "Име на албума");
    createChildElement(tableHeaderRow, "th", "Потребителско име на заявителя");
    createChildElement(tableHeaderRow, "th", "Имена на заявителя");

    albumExportRequestsTable.appendChild(tableHeaderRow)


    // Create table rows
    albumExportRequests.forEach(request => {
        const currentRow = document.createElement("tr");
        createChildElement(currentRow, "td", request.albumId);
        createChildElement(currentRow, "td", request.albumTitle);
        createChildElement(currentRow, "td", request.requestSenderUsername);
        createChildElement(currentRow, "td", request.senderFirstName + " " + request.senderLastName);
        albumExportRequestsTable.appendChild(currentRow);
    });
}