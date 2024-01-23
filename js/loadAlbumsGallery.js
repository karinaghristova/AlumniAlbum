var imageArray = [];

document.addEventListener("DOMContentLoaded", function () {
    loadImages();
    loadAlbums();
    loadPhotographersAndExportServices();
});

function loadImages() {
    getAllImages()
        .then(images => {
            var k = 0;
            images.forEach(image => {
                var currentImage = [];
                const imgElement = document.createElement('img');
                imgElement.src = `data:image/jpeg;base64,${image.data}`;
                imgElement.alt = image.name;

                // Create button element
                const exportBtn = document.createElement('button');
                exportBtn.textContent = 'Заяви експорт';

                // Add click event listener to button 
                exportBtn.addEventListener('click', function () {
                    alert(`Експортиране на снимка: ${image.name}`);
                    console.log(`Експортиране на снимка: ${image.name}`);
                    //console.log(image.id)

                    // Show request form 
                    const exportPhotoCard = document.getElementById('exportPhotoCard');
                    exportPhotoCard.style.display = 'block';

                    // Hide tables
                    const albumsContainer = document.getElementById("albumsContainer");
                    albumsContainer.style.display = "none";

                    //TODO: Implement functionality

                });

                const imgBtnContainer = document.createElement('div');
                imgBtnContainer.classList += "albumPhoto";
                imgElement.classList += "photoElement";
                exportBtn.classList += "photoExportBtn cardSmallBtn"
                imgBtnContainer.appendChild(imgElement);
                imgBtnContainer.appendChild(exportBtn);

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

function loadAlbums() {
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

function loadPhotographersAndExportServices() {
    const photographerSelect = document.getElementById("photographer");
    const exportServiceSelect = document.getElementById("photoExportService");

    // Fetch photographers
    fetch("../src/getAllPhotographers.php")
        .then(response => response.json())
        .then(data => {
            const photographers = data.photographers;

            photographers.forEach(photographer => {
                const option = document.createElement("option");
                option.value = photographer.id;
                option.textContent = photographer.name;
                photographerSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error fetching photographers:", error);
        });

    // Fetch export services
    fetch("../src/getAllExportServices.php")
        .then(response => response.json())
        .then(data => {
            const exportServices = data.exportServices;

            exportServices.forEach(exportService => {
                const option = document.createElement("option");
                option.value = exportService.id;
                option.textContent = exportService.name;
                exportServiceSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error fetching export services:", error);
        });
}

function populateSelectOptions(selectId, optionsData) {
    const selectElement = document.getElementById(selectId);

    // Clear existing options
    selectElement.innerHTML = '';

    // Populate select options
    optionsData.forEach(optionData => {
        const option = document.createElement('option');
        option.value = optionData.id;
        option.textContent = optionData.name;
        selectElement.appendChild(option);
    });
}