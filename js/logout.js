function logout() {
    fetch('../src/login.php', {
        method: 'DELETE',
    })
    .then(resp => resp.json())
    .then(resp => {
        if (resp.result) {
            window.location.replace('../views/login.html');
        } else {
            console.error('Logout failed:', resp.error);
        }
    })
    .catch(error => console.error('Error during logout:', error));
}
