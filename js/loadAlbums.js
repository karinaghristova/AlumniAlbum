document.addEventListener("DOMContentLoaded", function () {
    loadAlbums();
});

function loadAlbums() {
    const albumSelect = document.getElementById("albumName");
    
    getAllAlbums()
        .then(albums => {
            albumSelect.innerHTML = '';
            
            albums.forEach(album => {

                if (album.privacy == 1)
                {
                    const option = document.createElement("option");
                    option.value = album.id; 
                    option.textContent = album.title; 
                    albumSelect.appendChild(option);
                }
                
            });
        })
        .catch(error => {
            console.error("Error loading albums:", error);
        });
    
    getOwnerAlbums()
        .then(albums => {
            
            albums.forEach(album => {

                if (album.privacy == 0)
                {
                    const option = document.createElement("option");
                    option.value = album.id; 
                    option.textContent = album.title; 
                    albumSelect.appendChild(option);    
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
