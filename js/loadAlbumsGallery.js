var imageArray = [];

document.addEventListener("DOMContentLoaded", function () {
    getUserRole()
        .then(role => {
            loadImages(role);
            loadAlbums(role);
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

function loadImages(role) {
    getAllImages()
        .then(images => {
            var k = 0;
            images.forEach(image => {
                var currentImage = [];
                const imgElement = document.createElement('img');
                imgElement.src = `data:image/jpeg;base64,${image.data}`;
                imgElement.alt = image.name;




                const imgBtnContainer = document.createElement('div');
                imgBtnContainer.classList += "albumPhoto";
                imgElement.classList += "photoElement";
                imgBtnContainer.appendChild(imgElement);

                if (role == 1) {
                    // Create button element
                    const exportBtn = document.createElement('button');
                    exportBtn.textContent = 'Заяви експорт';

                    // Add click event listener to button 
                    exportBtn.addEventListener("click", () => sendPhotoExportRequest(image.id));
                    exportBtn.classList += "photoExportBtn cardSmallBtn"


                    imgBtnContainer.appendChild(exportBtn);
                }


                currentImage[0] = imgBtnContainer;
                currentImage[1] = image.albumId;
                currentImage[2] = image.name;

                imageArray[k] = currentImage;
                k++;
            });

            console.log(imageArray)
        })
        .catch(error => {
            console.error("Error loading images:", error);
        });
}

function loadAlbums(role) {
    const albumSelect = document.getElementById("privateAlbums");

    getOwnerAlbums()
        .then(albums => {
            const table = document.createElement("table");
            const tableHeadRow = document.createElement("tr");
            const tableHeadTitle = document.createElement("th");
            tableHeadTitle.textContent = "Заглавие на албум";
            const tableHead2 = document.createElement("th");
            tableHead2.textContent = "Снимки";


            tableHeadRow.appendChild(tableHeadTitle);
            tableHeadRow.appendChild(tableHead2);
            table.appendChild(tableHeadRow);

            albums.forEach(album => {

                if (album.privacy == 0) {
                    const tableRow = document.createElement("tr");
                    const albumTitleCell = document.createElement("td");
                    albumTitleCell.value = album.id;
                    albumTitleCell.textContent = album.title;

                    if (role == 1) {
                        const exportAlbumBtn = document.createElement("button");
                        exportAlbumBtn.innerHTML = "<i class=\"fa-solid fa-print\"></i>";

                        // Add click event listener to button 
                        exportAlbumBtn.addEventListener("click", () => sendAlbumExportRequest(album.id));

                        albumTitleCell.appendChild(exportAlbumBtn);
                    }

                    const albumRow = document.createElement("td");
                    albumRow.classList += "albumRow";

                    tableRow.appendChild(albumTitleCell);
                    tableRow.appendChild(albumRow);
                    table.appendChild(tableRow);

                    for (var i = 0; i < imageArray.length; i++) {
                        if (imageArray[i][1] == album.id) {
                            albumRow.appendChild(imageArray[i][0]);
                        }
                    }
                }

            });

            albumSelect.appendChild(table);

            const emptyPrivateAlbums = document.getElementById("emptyPrivateAlbums");
            emptyPrivateAlbums.style.display = "none";

        })
        .catch(error => {
            const albumsContainer = document.getElementById("privateAlbums");
            albumsContainer.style.display = "none";
            console.error("Error loading albums:", error);
        });

    const albumSelect2 = document.getElementById("publicAlbums");
    getAllAlbums()
        .then(albums => {

            const table = document.createElement("table");
            const tableHeadRow = document.createElement("tr");
            const tableHead = document.createElement("th");
            tableHead.textContent = "Заглавие на албум";
            const tableHead2 = document.createElement("th");
            tableHead2.textContent = "Снимки";


            tableHeadRow.appendChild(tableHead);
            tableHeadRow.appendChild(tableHead2);
            table.appendChild(tableHeadRow);

            albums.forEach(album => {

                if (album.privacy == 1) {

                    const tableRow = document.createElement("tr");
                    const albumTitleCell = document.createElement("td");
                    albumTitleCell.value = album.id;
                    albumTitleCell.textContent = album.title;

                    if (role == 1) {
                        const exportAlbumBtn = document.createElement("button");
                        exportAlbumBtn.innerHTML = "<i class=\"fa-solid fa-print\"></i>";

                        // Add click event listener to button 
                        exportAlbumBtn.addEventListener("click", () => sendAlbumExportRequest(album.id));

                        albumTitleCell.appendChild(exportAlbumBtn);
                    }

                    const albumRow = document.createElement("td");
                    albumRow.classList += "albumRow";

                    tableRow.appendChild(albumTitleCell);
                    tableRow.appendChild(albumRow);
                    table.appendChild(tableRow);

                    for (var i = 0; i < imageArray.length; i++) {
                        if (imageArray[i][1] == album.id) {
                            albumRow.appendChild(imageArray[i][0]);
                        }
                    }
                }

            });

            albumSelect2.appendChild(table);
            const emptyPublicAlbums = document.getElementById("emptyPublicAlbums");
            emptyPublicAlbums.style.display = "none";

        })
        .catch(error => {
            const publicAlbums = document.getElementById("publicAlbums");
            publicAlbums.style.display = "none";
            console.error("Error loading albums:", error);
        });

}

function getAllAlbums() {
    return fetch("../src/getAllAlbums.php")
        .then(response => {
            if (!response.ok) {
                throw new Error("Error fetching albums");
            }
            return response.json();
        })
        .then(data => data.albums)
        .catch(error => {
            console.error("Error fetching albums:", error);
            throw error;
        });
}

function getOwnerAlbums() {
    return fetch("../src/getOwnerAlbums.php")
        .then(response => {
            if (!response.ok) {
                throw new Error("Error fetching albums");
            }
            return response.json();
        })
        .then(data => data.albums)
        .catch(error => {
            console.error("Error fetching albums:", error);
            throw error;
        });
}

function getAllImages() {
    return fetch("../src/getAllImages.php")
        .then(response => {
            if (!response.ok) {
                throw new Error("Error fetching images");
            }
            return response.json();
        })
        .then(data => data.images)
        .catch(error => {
            console.error("Error fetching images:", error);
            throw error;
        });
}

function sendPhotoExportRequest(photoId) {
    //alert(`Експортиране на снимка`);
    console.log(`Експортиране на снимка`);

    // Show request form 
    const exportPhotoCard = document.getElementById('exportPhotoCard');
    exportPhotoCard.style.display = 'block';

    // Hide tables
    const albumsContainer = document.getElementById("albumsContainer");
    albumsContainer.style.display = "none";

    // Fetch information about photographers and export services
    fetch("../src/getInformationForPhotoExport.php")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const photographersData = data.photographers;
            const exportServicesData = data.exportServices;

            console.log("Photographers Data:", photographersData);
            console.log("Export Services Data:", exportServicesData);

            populateSelectOptionsInExportForm('photographer', photographersData);
            populateSelectOptionsInExportForm('photoExportService', exportServicesData);

            // Add submit event listener
            const exportPhotoCardForm = document.getElementById('exportPhotoCardForm');
            exportPhotoCardForm.addEventListener('submit', (event) => {
                event.preventDefault();

                const requestReceiverUsername = document.getElementById('photographer').value;
                const exportServiceId = document.getElementById('photoExportService').value;

                console.log(photoId);
                console.log(requestReceiverUsername,);
                console.log(exportServiceId);

                sendPhotoExportRequestToServer(photoId, exportServiceId, requestReceiverUsername,);
            });
        })
        .catch(error => {
            console.error("Error fetching photo export information:", error.message);
        });
}

function populateSelectOptionsInExportForm(selectId, optionsData) {
    console.log(optionsData)
    const selectElement = document.getElementById(selectId);
    selectElement.innerHTML = '';

    if (selectId == 'photographer') {
        optionsData.forEach(optionData => {
            const option = document.createElement('option');
            option.value = optionData.username;
            option.textContent = `${optionData.firstName} ${optionData.lastName}`;
            selectElement.appendChild(option);
        });
    } else {
        optionsData.forEach(optionData => {
            const option = document.createElement('option');
            option.value = optionData.id;
            option.textContent = optionData.serviceName;
            selectElement.appendChild(option);
        });
    }
}

function sendPhotoExportRequestToServer(photoId, exportServiceId, requestReceiverUsername) {
    const formData = new FormData();
    formData.append('photoId', photoId);
    formData.append('exportServiceId', exportServiceId);
    formData.append('requestReceiverUsername', requestReceiverUsername);

    console.log("Sending FormData:", formData);

    fetch("../src/sendPhotoExportRequest.php", {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            console.log("Server response:", data);
            //TODO: Redirect to other page
        })
        .catch(error => {
            console.error("Error sending export request:", error);
        });
}

function sendAlbumExportRequest(albumId) {
    console.log(albumId);

    // Show request form 
    const exportAlbumCard = document.getElementById('exportAlbumCard');
    exportAlbumCard.style.display = 'block';

    // Hide tables
    const albumsContainer = document.getElementById("albumsContainer");
    albumsContainer.style.display = "none";
    // Fetch information about photographers and export services
    fetch("../src/getAllPhotographers.php")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const photographersData = data.photographers;

            console.log(photographersData)

            console.log("Photographers Data:", photographersData);

            //
            const selectElement = document.getElementById('photographerAlbumSelect');
            selectElement.innerHTML = '';

            photographersData.forEach(optionData => {
                const option = document.createElement('option');
                option.value = optionData.username;
                option.textContent = `${optionData.firstName} ${optionData.lastName}`;
                selectElement.appendChild(option);
            });


            // Add submit event listener
            const exportAlbumCardForm = document.getElementById('exportAlbumCardForm');
            exportAlbumCardForm.addEventListener('submit', (event) => {
                event.preventDefault();

                const requestReceiverUsername = document.getElementById('photographerAlbumSelect').value;

                console.log(albumId);
                console.log(requestReceiverUsername,);

                sendAlbumExportRequestToServer(albumId, requestReceiverUsername,);
            });
        })
        .catch(error => {
            console.error("Error fetching photo export information:", error.message);
        });
}

function sendAlbumExportRequestToServer(albumId, requestReceiverUsername,) {
    const formData = new FormData();
    formData.append('albumId', albumId);
    formData.append('requestReceiverUsername', requestReceiverUsername);

    console.log("Sending FormData:", formData);
    console.log(albumId);
    console.log(requestReceiverUsername)

    fetch("../src/sendAlbumExportRequest.php", {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            console.log("Server response:", data);
            //TODO: Redirect to other page
        })
        .catch(error => {
            console.error("Error sending export request:", error);
        });
}