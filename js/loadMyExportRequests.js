document.addEventListener("DOMContentLoaded", function () {
    getUserRole()
        .then(role => {
            getAllPhotoExportRequests(role);
            getAllAlbumExportRequests(role);

            // Add event listener for photo export requests button
            document.getElementById("photoExportRequestsDownloadBtn").addEventListener("click", function () {
                fetch("../src/getAllPhotoExportRequests.php")
                    .then(response => response.json())
                    .then(data => {
                        console.log("Data from response:");
                        console.log(data);
                        downloadPhotoExportRequestsAsCSV(data);
                    })
                    .catch(error => console.error("Error fetching photo export requests:", error.message));
            });


            // Add event listener for album export requests button
            document.getElementById("albumExportRequestsDownloadBtn").addEventListener("click", function () {
                fetch("../src/getAllAlbumExportRequests.php")
                    .then(response => response.json())
                    .then(data => {
                        console.log("Data from response:");
                        console.log(data);
                        downloadAlbumExportRequestsAsCSV(data);
                    })
                    .catch(error => console.error("Error fetching photo export requests:", error.message));
            });
        })
        .catch(error => {
            console.error("Error getting user role:", error);
        });


});

function getUserRole() {
    return fetch("../src/getUserRole.php")
        .then(response => {
            if (!response.ok) {
                throw new Error("Error fetching user role");
            }
            return response.json();
        })
        .then(data => data.role)
        .catch(error => {
            console.error("Error fetching user role:", error);
            throw error;
        });
}

function getAllPhotoExportRequests(role) {
    fetch("../src/getAllPhotoExportRequests.php")
        .then(response => response.json())
        .then(data => {
            const photoExportRequests = data.photoExportRequests;
            console.log(photoExportRequests)
            showPhotoExportRequests(role, photoExportRequests);
        })
        .catch(error => {
            document.getElementById("emptyPhotoExportRequests").style.display = "block";
            document.getElementById("photoExportRequests").style.display = "none";
            document.getElementById("photoExportRequestsDownloadBtn").style.display = "none";
            console.error("Error fetching photo export requests:", error.message);
        });
}

function getAllAlbumExportRequests(role) {
    fetch("../src/getAllAlbumExportRequests.php")
        .then(response => response.json())
        .then(data => {
            const albumExportRequests = data.albumExportRequests;

            showAlbumExportRequests(role,albumExportRequests);
        })
        .catch(error => {
            document.getElementById("emptyAlbumExportRequests").style.display = "block";
            document.getElementById("albumExportRequests").style.display = "none";
            document.getElementById('albumExportRequestsDownloadBtn').style.display = "none";
            console.error("Error fetching album export requests:", error.message);
        });
}

function createChildElement(parentElement, childElementType, textContentValue) {
    const childElement = document.createElement(childElementType);
    childElement.textContent = textContentValue;
    parentElement.appendChild(childElement);
}

function createPhotoInfoElement(parentElement, childElementType, photoId, photoName) {
    const childElement = document.createElement(childElementType);
    createChildElement(childElement, "p", `ID: ${photoId}`);
    createChildElement(childElement, "p", `Име: ${photoName}`)
    parentElement.appendChild(childElement);
}

function createPhotoColumn(parentElement, photoData, photoName) {
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


function showPhotoExportRequests(role,photoExportRequests) {
    const photoExportRequestsTable = document.getElementById("photoExportRequestsTable");
    photoExportRequestsTable.innerHTML = "";

    // Create table header
    const tableHeaderRow = document.createElement("tr");
    createChildElement(tableHeaderRow, "th", "Снимка");
    createChildElement(tableHeaderRow, "th", "Информация за снимка");
    createChildElement(tableHeaderRow, "th", "Вид на услугата");
    createChildElement(tableHeaderRow, "th", "Брой");
    if (role == 1 ) { //student
        createChildElement(tableHeaderRow, "th", "Потребителско име на фотографа");
        createChildElement(tableHeaderRow, "th", "Имена на фотографа");
    }

    if(role == 2){ //photographer
        createChildElement(tableHeaderRow, "th", "Потребителско име на заявителя");
        createChildElement(tableHeaderRow, "th", "Имена на заявителя");
    }
    

    photoExportRequestsTable.appendChild(tableHeaderRow)

    // Create table rows
    photoExportRequests.forEach(request => {
        const currentRow = document.createElement("tr");

        createPhotoColumn(currentRow, request.photoData, request.photoName);
        createPhotoInfoElement(currentRow, "td", request.photoId, request.photoName);
        createChildElement(currentRow, "td", request.serviceName);
        createChildElement(currentRow, "td", request.count);
        if (role == 1) {
            createChildElement(currentRow, "td", request.requestReceiverUsername);
            createChildElement(currentRow, "td", request.receiverFirstName + " " + request.receiverLastName);
        }

        if (role == 2) {
            createChildElement(currentRow, "td", request.requestSenderUsername);
            createChildElement(currentRow, "td", request.senderFirstName + " " + request.senderLastName);
        }
        
        photoExportRequestsTable.appendChild(currentRow);
    });
}

function showAlbumExportRequests(role, albumExportRequests) {
    const albumExportRequestsTable = document.getElementById("albumExportRequestsTable");
    albumExportRequestsTable.innerHTML = "";

    // Create table header
    const tableHeaderRow = document.createElement("tr");
    createChildElement(tableHeaderRow, "th", "ID на албума");
    createChildElement(tableHeaderRow, "th", "Име на албума");
    createChildElement(tableHeaderRow, "th", "Брой");
    if (role == 1 ) { //student
        createChildElement(tableHeaderRow, "th", "Потребителско име на фотографа");
        createChildElement(tableHeaderRow, "th", "Имена на фотографа");
    }

    if(role == 2){ //photographer
        createChildElement(tableHeaderRow, "th", "Потребителско име на заявителя");
        createChildElement(tableHeaderRow, "th", "Имена на заявителя");
    }

    albumExportRequestsTable.appendChild(tableHeaderRow)


    // Create table rows
    albumExportRequests.forEach(request => {
        const currentRow = document.createElement("tr");
        createChildElement(currentRow, "td", request.albumId);
        createChildElement(currentRow, "td", request.albumTitle);
        createChildElement(currentRow, "td", request.count);
        if (role == 1) {
            createChildElement(currentRow, "td", request.requestReceiverUsername);
            createChildElement(currentRow, "td", request.receiverFirstName + " " + request.receiverLastName);
        }

        if (role == 2) {
            createChildElement(currentRow, "td", request.requestSenderUsername);
            createChildElement(currentRow, "td", request.senderFirstName + " " + request.senderLastName);
        }
        albumExportRequestsTable.appendChild(currentRow);
    });
}

function downloadCSV(content, filename) {
    const csvBlob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), content], { type: 'text/csv; charset=utf-8' });

    // Create link and trigger download
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(csvBlob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function downloadPhotoExportRequestsAsCSV(data) {
    if (!data || !Array.isArray(data.photoExportRequests)) {
        console.error("Data is not in correct format. Array is expected");
        return;
    }

    const csvData = data.photoExportRequests.map(request => {
        if (!request.photoId ||
            !request.photoName ||
            !request.serviceName ||
            !request.count ||
            !request.requestSenderUsername ||
            !request.senderFirstName ||
            !request.senderLastName
        ) {
            console.error("Missing export requests data");
            return "";
        }

        const rowContent = [
            request.photoId,
            request.photoName,
            request.serviceName,
            request.count,
            request.requestSenderUsername,
            `${request.senderFirstName} ${request.senderLastName}`
        ].join(";");
        return rowContent;
    });

    const csvContent = ["ID на снимка;Име на снимка;Вид на услугата;Брой;Потребителско име на заявителя;Имена на заявителя"].concat(csvData).join("\n");

    // Trigger  download
    downloadCSV(csvContent, 'photo_export_requests.csv');
}

function downloadAlbumExportRequestsAsCSV(data) {
    if (!data || !Array.isArray(data.albumExportRequests)) {
        console.error("Data is not in correct format. Array is expected");
        return;
    }

    const csvData = data.albumExportRequests.map(request => {
        if (!request.albumId ||
            !request.albumTitle ||
            !request.count ||
            !request.requestSenderUsername ||
            !request.senderFirstName ||
            !request.senderLastName
        ) {
            console.error("Missing export requests data");
            return "";
        }

        const rowContent = [
            request.albumId,
            request.albumTitle,
            request.count,
            request.requestSenderUsername,
            `${request.senderFirstName} ${request.senderLastName}`
        ].join(";");
        return rowContent;
    });

    const csvContent = ["ID на албум;Име на албум;Брой;Потребителско име на заявителя;Имена на заявителя"].concat(csvData).join("\n");

    // Trigger download
    downloadCSV(csvContent, 'album_export_requests.csv');
}


