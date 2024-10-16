let accessToken = '';
const folderId = '1_9AfIlKX_lOF0uRZoSBzYQI_R7AJ2gXd';
const client_id = '297903435633-jim9ju0srggs9akerf9s44hs7ojh2ucm.apps.googleusercontent.com'

// Inicializa el SDK de Google Identity Services
function initGoogleSignIn() {

    if (accessToken == '')
    {

    google.accounts.id.initialize({
        client_id: client_id,
        callback: handleCredentialResponse
    });

    google.accounts.id.prompt(); // Muestra el cuadro de inicio de sesión cuando es necesario

    }else{
        updateImagesOnServer(accessToken, folderId)
    }
}

// Maneja la respuesta de autenticación
function handleCredentialResponse(response) {
    console.log('Token JWT recibido: ', response.credential);
    getAccessToken();
}

// Función para obtener el token de acceso (Access Token) de Google OAuth 2.0
function getAccessToken() {
    google.accounts.oauth2.initTokenClient({
        client_id: client_id,
        scope: 'https://www.googleapis.com/auth/drive.readonly',
        callback: (response) => {
            accessToken = response.access_token;
            console.log('Token de acceso obtenido:', accessToken);

            // Ahora sincronizamos las imagenes
            updateImagesOnServer(accessToken, folderId);
        },
    }).requestAccessToken();
}


function updateImagesOnServer(accessToken, folderId) {
    fetch('/update_images', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            access_token: accessToken,
            folder_id: folderId
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Respuesta del servidor:', data);
        alert('Las imágenes se han actualizado con éxito.');
        window.location.reload();
    })
    .catch(error => {
        console.error('Error al actualizar las imágenes:', error);
        alert('Hubo un problema al actualizar las imágenes.');
    });
}