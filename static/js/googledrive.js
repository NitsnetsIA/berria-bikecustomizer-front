let accessToken = localStorage.getItem('accessToken') || '';
const folderId = '1_9AfIlKX_lOF0uRZoSBzYQI_R7AJ2gXd';
const client_id = '297903435633-jim9ju0srggs9akerf9s44hs7ojh2ucm.apps.googleusercontent.com';

// Inicializa el SDK de Google Identity Services
function initGoogleSignIn() {
    if (accessToken === '') {
        google.accounts.id.initialize({
            client_id: client_id,
            callback: handleCredentialResponse
        });

        google.accounts.id.prompt(); // Muestra el cuadro de inicio de sesión cuando es necesario
    } else {
        validateTokenAndProceed();
    }
}

// Valida el token y actualiza las imágenes si es válido
function validateTokenAndProceed() {
    fetch('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + accessToken)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.log('Token inválido o expirado. Necesita iniciar sesión de nuevo.');
                google.accounts.id.initialize({
                    client_id: client_id,
                    callback: handleCredentialResponse
                });
        
                google.accounts.id.prompt(); // Muestra el cuadro de inicio de sesión cuando es necesario
            } else {
                console.log('Token válido.');
                updateImagesOnServer(accessToken, folderId);
            }
        })
        .catch(error => {
            console.error('Error al validar el token:', error);
        });
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
            localStorage.setItem('accessToken', accessToken);
            console.log('Token de acceso obtenido:', accessToken);

            // Ahora sincronizamos las imágenes
            updateImagesOnServer(accessToken, folderId);
        },
    }).requestAccessToken();
}

function updateImagesOnServer(accessToken, folderId) {

    //mostrar modal de carga
    $('#loadingModal').addClass('active');


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
        window.location.reload();
    })
    .catch(error => {
        console.error('Error al actualizar las imágenes:', error);
        alert('Hubo un problema al actualizar las imágenes.');
    });
}

function resetToken() {
    
    localStorage.removeItem('accessToken');
    accessToken = '';
    initGoogleSignIn()
}
