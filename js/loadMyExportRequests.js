document.addEventListener("DOMContentLoaded", function () {
    getAllPhotoExportRequests();
    getAllAlbumExportRequests();
});

function getAllPhotoExportRequests() {
    fetch("../src/getAllPhotoExportRequests.php")
        .then(response => response.json())
        .then(data => {
            const photoExportRequests = data.photoExportRequests;
            console.log(photoExportRequests)
            showPhotoExportRequests(photoExportRequests);
        })
        .catch(error => {
            console.error("Error fetching photo export requests:", error.message);
        });
}

function getAllAlbumExportRequests() {
    fetch("../src/getAllAlbumExportRequests.php")
        .then(response => response.json())
        .then(data => {
            const albumExportRequests = data.albumExportRequests;

            showAlbumExportRequests(albumExportRequests);
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

function createPhotoInfoElement(parentElement, childElementType, photoId, photoName){
    const childElement = document.createElement(childElementType);
    createChildElement(childElement, "p", `ID: ${photoId}`);
    createChildElement(childElement, "p", `Име: ${photoName}`)
    parentElement.appendChild(childElement);
}

function createPhotoColumn(parentElement, photoData, photoName){
    const imageTd = document.createElement("td");
    const imgElement = document.createElement('img');
    imgElement.src = `data:image/jpeg;base64,${photoData}`
    imgElement.alt = photoName;
    const imgContainer = document.createElement('div');
    imgContainer.textContent = photoName;
    imgElement.classList += "photoElement";
    imgContainer.appendChild(imgElement);
    imageTd.appendChild(imgContainer);

    parentElement.appendChild(imageTd);
}


function showPhotoExportRequests(photoExportRequests) {
    const photoExportRequestsTable = document.getElementById("photoExportRequestsTable");
    photoExportRequestsTable.innerHTML = "";

    // Create table header
    const tableHeaderRow = document.createElement("tr");
    createChildElement(tableHeaderRow, "th", "Снимка");
    createChildElement(tableHeaderRow, "th", "Информация за снимка");
    createChildElement(tableHeaderRow, "th", "Вид на услугата");
    createChildElement(tableHeaderRow, "th", "Брой");
    createChildElement(tableHeaderRow, "th", "Потребителско име");
    createChildElement(tableHeaderRow, "th", "Имена");

    photoExportRequestsTable.appendChild(tableHeaderRow)

    // Create table rows
    photoExportRequests.forEach(request => {
        const currentRow = document.createElement("tr");

        createPhotoColumn(currentRow, request.photoData, request.photoName);
        createPhotoInfoElement(currentRow, "td", request.photoId,request.photoName);
        createChildElement(currentRow, "td", request.serviceName);
        createChildElement(currentRow, "td", request.count);
        createChildElement(currentRow, "td", request.requestSenderUsername);
        createChildElement(currentRow, "td", request.senderFirstName + " " + request.senderLastName);
        
        photoExportRequestsTable.appendChild(currentRow);
    });
}

function showAlbumExportRequests(albumExportRequests) {
    const albumExportRequestsTable = document.getElementById("albumExportRequestsTable");
    albumExportRequestsTable.innerHTML = "";

    // Create table header
    const tableHeaderRow = document.createElement("tr");
    createChildElement(tableHeaderRow, "th", "ID на албума");
    createChildElement(tableHeaderRow, "th", "Име на албума");
    createChildElement(tableHeaderRow, "th", "Брой");
    createChildElement(tableHeaderRow, "th", "Потребителско име");
    createChildElement(tableHeaderRow, "th", "Имена");

    albumExportRequestsTable.appendChild(tableHeaderRow)


    // Create table rows
    albumExportRequests.forEach(request => {
        const currentRow = document.createElement("tr");
        createChildElement(currentRow, "td", request.albumId);
        createChildElement(currentRow, "td", request.albumTitle);
        createChildElement(currentRow, "td", request.count);
        createChildElement(currentRow, "td", request.requestSenderUsername);
        createChildElement(currentRow, "td", request.senderFirstName + " " + request.senderLastName);
        albumExportRequestsTable.appendChild(currentRow);
    });
}