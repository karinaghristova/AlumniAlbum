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
            
            albums.forEach(album => {

                if (album.privacy == 0)
                {
                    const table = document.createElement("table");
                    const option = document.createElement("th");
                    option.value = album.id; 
                    option.textContent = album.title; 

                    albumSelect.appendChild(table);
                    table.appendChild(option);    
                }
            
            });
        })
        .catch(error => {
            console.error("Error loading albums:", error);
        });
    
    const albumSelect2 = document.getElementById("galleryContainer2");
    getAllAlbums()
        .then(albums => {
            
            albums.forEach(album => {

                if (album.privacy == 1)
                {
                    const table = document.createElement("table");
                    const option = document.createElement("th");
                    option.value = album.id; 
                    option.textContent = album.title; 

                    albumSelect2.appendChild(table);
                    table.appendChild(option); 
                }
                
            });
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