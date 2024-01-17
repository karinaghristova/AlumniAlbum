
var config = {
    cUrl: 'https://api.countrystatecity.in/v1/countries',
    ckey: 'NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA=='
}

var countrySelect = document.querySelector('.country');

function loadAlbums() {

    let apiEndPoint = config.cUrl

    fetch(apiEndPoint, {headers: {"X-CSCAPI-KEY": config.ckey}})
    .then(Response => Response.json())
    .then(data => {
        // console.log(data);

        data.forEach(country => {
            const option = document.createElement('option')
            option.value = country.iso2
            option.textContent = country.name 
            countrySelect.appendChild(option)
        })
    })
    .catch(error => console.error('Error loading countries:', error))

    // stateSelect.disabled = true
    // citySelect.disabled = true
    // stateSelect.style.pointerEvents = 'none'
    // citySelect.style.pointerEvents = 'none'
}

window.onload = loadAlbums

// function fetchProfileData() {
//     fetch("../src/myProfile.php")
//         .then(response => response.json())
//         .then(data => {
//             console.log("Profile data:", data);

//             if (data.userData) {
//                 const userData = data.userData;
//                 updateProfileContent(userData);
//             } else {
//                 console.error("Error fetching profile data:", data.error);
//             }
//         })
//         .catch(error => {
//             console.error("Error fetching profile data:", error);
//         });
// }

// // Create new elements for the container
// function updateProfileContent(userData) {
//     const selectAlbum = document.getElementById("albumName");

//     const heading = document.createElement("option");
//     //heading.textContent = "Основна информация";
   
//     heading.value = userData.title; 
//     selectAlbum.appendChild(heading);
    
    
    
// }

// // Call the fetchProfileData function when the page loads
// document.addEventListener("DOMContentLoaded", fetchProfileData);

