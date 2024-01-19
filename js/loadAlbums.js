document.addEventListener("DOMContentLoaded", function () {
    loadAlbums();
});

function loadAlbums() {
    const albumSelect = document.getElementById("albumName");
    // Fetch all albums
    getAllAlbums()
        .then(albums => {
            albumSelect.innerHTML = '';
            // Fill select with album options
            albums.forEach(album => {
                const option = document.createElement("option");
                option.value = album.id; 
                option.textContent = album.title; 
                albumSelect.appendChild(option);
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
