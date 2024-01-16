function logout() {
    fetch('../src/login.php', {
        method: 'DELETE',
    })
    .then(resp => resp.json())
    .then(resp => {
        if (resp.result) {
            // Redirect or perform any other action after logout
            window.location.replace('../views/login.html');
        } else {
            console.error('Logout failed:', resp.error);
            // Handle logout failure if needed
        }
    })
    .catch(error => console.error('Error during logout:', error));
}
