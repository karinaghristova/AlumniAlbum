document.addEventListener("DOMContentLoaded", function () {
    loadAlbums();
});

function loadAlbums() {
    const albumSelect = document.getElementById("galleryContainer1");
    getAllImages()
        .then(images => {
            //TO DO
        })
        .catch(error => {
            console.error("Error loading images:", error);
        });


    getOwnerAlbums()
        .then(albums => {
            const table = document.createElement("table");
            const tableHeadRow = document.createElement("tr");
            const tableHead = document.createElement("th");
            tableHead.textContent = "Заглавие на албум";

            tableHeadRow.appendChild(tableHead);
            table.appendChild(tableHeadRow);

            albums.forEach(album => {

                if (album.privacy == 0) {
                    const tableRow = document.createElement("tr");
                    const albumRow = document.createElement("td");
                    albumRow.value = album.id;
                    albumRow.textContent = album.title;

                    tableRow.appendChild(albumRow);
                    table.appendChild(tableRow);
                }

            });

            albumSelect.appendChild(table);

        })
        .catch(error => {
            console.error("Error loading albums:", error);
        });

    const albumSelect2 = document.getElementById("galleryContainer2");
    getAllAlbums()
        .then(albums => {

            const table = document.createElement("table");
            const tableHeadRow = document.createElement("tr");
            const tableHead = document.createElement("th");
            tableHead.textContent = "Заглавие на албум";

            tableHeadRow.appendChild(tableHead);
            table.appendChild(tableHeadRow);

            albums.forEach(album => {

                if (album.privacy == 1) {
                    const tableRow = document.createElement("tr");
                    const albumRow = document.createElement("td");
                    albumRow.value = album.id;
                    albumRow.textContent = album.title;

                    tableRow.appendChild(albumRow);
                    table.appendChild(tableRow);
                }

            });

            albumSelect2.appendChild(table);

        })
        .catch(error => {
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