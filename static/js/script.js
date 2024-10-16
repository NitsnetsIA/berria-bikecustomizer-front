
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
    })
    .catch(error => {
        console.error('Error al actualizar las imágenes:', error);
        alert('Hubo un problema al actualizar las imágenes.');
    });
}

document.addEventListener('DOMContentLoaded', function() {

    const acceptBtn = document.getElementById('accept-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const resetBtn = document.getElementById('reset-btn');

    const bikeColors = {
        layer0: 'XX',
        background: 'C105',
        color1: 'C105',
        color2: 'C01',
        graphic1: 'C01',
        graphic2: 'C01',
        layer6: 'XX'
    };

    const colorCodes = [
        { code: "C01", hex: "#000000", desc: "BLACK" }, 
        { code: "C01", hex: "#0C0C0C", desc: "BLACK EBONY" },
        { code: "C02", hex: "#FFFFFF", desc: "WHITE" },
        { code: "C02", hex: "#FFFAFA", desc: "WHITE SNOW" },
        { code: "C03", hex: "#FF0000", desc: "ROJO" },
        { code: "C04", hex: "#FF073A", desc: "ROJO NEON" },
        { code: "C100", hex: "#00FF00", desc: "GREEN SCALE" },
        { code: "C101", hex: "#FF0033", desc: "ELECTRIC RED" },
        { code: "C102", hex: "#E0FFFF", desc: "HOLOGRAPHIC" },
        { code: "C103", hex: "#DAA520", desc: "ISLE OF MAN" },
        { code: "C104", hex: "#B87333", desc: "BRUSHED COPPER" },
        { code: "C105", hex: "#E6E6FA", desc: "RAINBOW LITE" },
        { code: "C106", hex: "#000080", desc: "NKD CARBON BLUE" },
        { code: "C107", hex: "#008000", desc: "LUCKY GREEN" },
        { code: "C108", hex: "#B87333", desc: "COPPER CUP" },
        { code: "C109", hex: "#EDC9AF", desc: "DESERT STORM" },
        { code: "C110", hex: "#FFDAB9", desc: "PEACH FUZZ" },
        { code: "C13", hex: "#0000FF", desc: "BLUE ELECTRO" },
        { code: "C15", hex: "#40E0D0", desc: "TURQUESA" },
        { code: "C16", hex: "#2F4F4F", desc: "ANTRACITA" },
        { code: "C17", hex: "#C0C0C0", desc: "GREY SILVER" },
        { code: "C17", hex: "#C0C0C0", desc: "SILVER" },
        { code: "C19", hex: "#1C1C1C", desc: "UD CARBON" },
        { code: "C21", hex: "#FF69B4", desc: "ROSA FLUO" },
        { code: "C22", hex: "#696969", desc: "GREY KERONITE" },
        { code: "C22", hex: "#A9A9A9", desc: "KERONITE" },
        { code: "C24", hex: "#228B22", desc: "GREEN JUNGLE" },
        { code: "C25", hex: "#708090", desc: "GREY QUANTUM" },
        { code: "C25", hex: "#778899", desc: "QUANTUM GREY" },
        { code: "C26", hex: "#A52A2A", desc: "BROWN BRONZE" },
        { code: "C27", hex: "#FFA500", desc: "NARANJA" },
        { code: "C28", hex: "#FFD700", desc: "YELLOW RACING" },
        { code: "C28", hex: "#FFDA03", desc: "YELLOW SUNFLOWER" },
        { code: "C29", hex: "#004225", desc: "VERDE BRITISH RAC" },
        { code: "C30", hex: "#9B111E", desc: "RED RUBY" },
        { code: "C32", hex: "#FFF0E0", desc: "MARFIL LUX" },
        { code: "C33", hex: "#98FF98", desc: "GREEN MINT" },
        { code: "C34", hex: "#FF4500", desc: "RED RACING" },
        { code: "C37", hex: "#0F52BA", desc: "BLUE SAPPHIRE" },
        { code: "C40", hex: "#E5E4E2", desc: "CHROME" },
        { code: "C44", hex: "#1E90FF", desc: "AZUL MAR" },
        { code: "C45", hex: "#4169E1", desc: "AZUL RACING" },
        { code: "C46", hex: "#00FA9A", desc: "VERDE MIAMI" },
        { code: "C48", hex: "#A52A2A", desc: "BROWN" },
        { code: "C48", hex: "#BC8F8F", desc: "BROWN MAPLE" },
        { code: "C49", hex: "#6A0DAD", desc: "PURPURA REAL" },
        { code: "C50", hex: "#FFD700", desc: "AMARILLO FUEGO" },
        { code: "C55", hex: "#FAEBD7", desc: "CHAMPAGNE DIAMON" },
        { code: "C56", hex: "#0000CD", desc: "BLUE RACING" },
        { code: "C58", hex: "#D3D3D3", desc: "CAMALEON" },
        { code: "C59", hex: "#1E90FF", desc: "BLUE CRYSTAL" },
        { code: "C60", hex: "#00FFFF", desc: "CYAN PURPLE" },
        { code: "C61", hex: "#FFD700", desc: "GOLD IVORY" },
        { code: "C61", hex: "#FFFFF0", desc: "IVORY" },
        { code: "C62", hex: "#F8F8FF", desc: "WHITE PEARL" },
        { code: "C63", hex: "#0B0B0B", desc: "BLACK COSMOS" },
        { code: "C65", hex: "#B0E0E6", desc: "BLUE MIST" },
        { code: "C66", hex: "#FFFF00", desc: "YELLOW FLUOR" },
        { code: "C67", hex: "#007FFF", desc: "BLUE OCEAN" },
        { code: "C68", hex: "#FF4500", desc: "RED FIRE" },
        { code: "C69", hex: "#FFD700", desc: "GOLD" },
        { code: "C70", hex: "#50C878", desc: "GREEN ESMERALD" },
        { code: "C71", hex: "#FFA500", desc: "ORANGE" },
        { code: "C72", hex: "#FF007F", desc: "ROSE AIR" },
        { code: "C73", hex: "#00FA9A", desc: "GREEN MIAMI" },
        { code: "C74", hex: "#00FF7F", desc: "GREEN CHAMALEON" },
        { code: "C75", hex: "#32CD32", desc: "GREEN LIME" },
        { code: "C76", hex: "#BEBEBE", desc: "GREY RAINBOW" },
        { code: "C77", hex: "#B87333", desc: "COPPER RASH" },
        { code: "C78", hex: "#DAA520", desc: "COPPER GOLD" },
        { code: "C79", hex: "#228B22", desc: "GREEN JUNGLE" },
        { code: "C80", hex: "#A9A9A9", desc: "DARK GREY" },
        { code: "C81", hex: "#00FFFF", desc: "AQUA" },
        { code: "C82", hex: "#0000CD", desc: "BLUE CRUSH" },
        { code: "C83", hex: "#00FFFF", desc: "AQUARACER" },
        { code: "C84", hex: "#FFA07A", desc: "TANGERINE" },
        { code: "C85", hex: "#8A2BE2", desc: "ULTRAVIOLET" },
        { code: "C86", hex: "#FF00FF", desc: "MAGENTA VIBE" },
        { code: "C87", hex: "#00FFFF", desc: "CYAN TEAM" },
        { code: "C88", hex: "#D3D3D3", desc: "CHALK GREY" },
        { code: "C89", hex: "#006400", desc: "NKD CARBON GREEN" },
        { code: "C90", hex: "#8B0000", desc: "NKD CARBON RED" },
        { code: "C91", hex: "#696969", desc: "NAKED CARBON" },
        { code: "C92", hex: "#5F4B8B", desc: "VERI PERY" },
        { code: "C93", hex: "#D3D3D3", desc: "LIQUID METAL" },
        { code: "C94", hex: "#98FF98", desc: "SPRING MINT" },
        { code: "C95", hex: "#808080", desc: "OIL SLICK" },
        { code: "C96", hex: "#BEBEBE", desc: "GREY SCALE" },
        { code: "C97", hex: "#D2B48C", desc: "WARM SCALE" },
        { code: "C98", hex: "#FF6347", desc: "RED SCALE" },
        { code: "C99", hex: "#4682B4", desc: "BLUE SCALE" }
    ];

    const layers = [
        { layer: 1, colors: ["C86", "C88", "C93", "C94", "C95", "C105"] }, // background-colors
        { layer: 2, colors: ["C83", "C84", "C86", "C88", "C93", "C94", "C95", "C105"] }, // color1-options
        { layer: 3, colors: ["C01", "C22", "C34", "C62", "C75", "C83", "C84", "C88"] }, // color2-options
        { layer: 4, colors: ["C01", "C02", "C22"] }, // graphic1-options
        { layer: 5, colors: ["C01", "C02", "C22"] }  // graphic2-options
    ];
    
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
            })
            .catch(error => {
                console.error('Error al actualizar las imágenes:', error);
                alert('Hubo un problema al actualizar las imágenes.');
            });
        }


    function createColorOptions(containerId, layer) {
        const container = document.getElementById(containerId);
        container.innerHTML = ''; // Limpiar el contenido actual
    
        // Buscar los colores asociados a la capa en el array "layers"
        const layerColors = layers.find(l => l.layer === layer).colors;
    
        // Crear los divs de color
        layerColors.forEach(colorCode => {
            color = colorCodes.find(color => color.code === colorCode)
            const div = document.createElement('div');
            div.className = 'color-option';
            div.setAttribute('title', `${color.desc}`);
            div.setAttribute('data-color', `${color.code}`);
            div.style.backgroundColor = color.hex; // Asignar el color hexadecimal
            container.appendChild(div);
        });
    }
    
    // Llamar a la función para cada capa
    createColorOptions('background-colors', 1); // Capa 1 para el fondo
    createColorOptions('color1-options', 2);    // Capa 2 para color1
    createColorOptions('color2-options', 3);    // Capa 3 para color2
    createColorOptions('graphic1-options', 4);  // Capa 4 para gráfico 1
    createColorOptions('graphic2-options', 5);  // Capa 5 para gráfico 2
    let colorOptions = document.querySelectorAll('.color-option');


    function updateBikeImage() {
        const parts = {
            layer0: '0-0',
            background: '0-1',
            color1: '0-2',
            color2: '0-3',
            graphic1: '0-4',
            graphic2: '0-5',
            layer6: '0-6'
        };

        Object.keys(parts).forEach(part => {
            const imgElement = document.getElementById(`${part}-layer`);
            if (imgElement) {
                const colorCode = bikeColors[part];
                imgElement.src = `/static/images/MAKO-${parts[part]}-${colorCode}-XX-XX-XX.png`;
            }
        });
        console.log('Current bike configuration:', bikeColors);
    }

    function setActiveOption(options, selectedOption) {
        options.forEach(option => option.classList.remove('active'));
        selectedOption.classList.add('active');
    }

    acceptBtn.addEventListener('click', function() {
        alert('Customization accepted!');
        // Here you would typically send the configuration to a server or perform further actions
    });

    cancelBtn.addEventListener('click', resetCustomization);

    resetBtn.addEventListener('click', resetCustomization);

    function resetCustomization() {

        // Reset all options to default
        colorOptions.forEach(option => option.classList.remove('active'));
        document.querySelector('#background-colors .color-option:first-child').classList.add('active');
        document.querySelector('#color1-options .color-option:first-child').classList.add('active');
        document.querySelector('#color2-options .color-option:first-child').classList.add('active');
        document.querySelector('#graphic1-options .color-option:first-child').classList.add('active');
        document.querySelector('#graphic2-options .color-option:first-child').classList.add('active');

        // Reset bikeColors object 
        bikeColors.layer0 = 'XX';
        bikeColors.background = document.querySelector('#background-colors .color-option:first-child').getAttribute('data-color');
        bikeColors.color1 = document.querySelector('#color1-options .color-option:first-child').getAttribute('data-color');
        bikeColors.color2 = document.querySelector('#color2-options .color-option:first-child').getAttribute('data-color');
        bikeColors.graphic1 = document.querySelector('#graphic1-options .color-option:first-child').getAttribute('data-color');
        bikeColors.graphic2 = document.querySelector('#graphic2-options .color-option:first-child').getAttribute('data-color');
        bikeColors.layer6 = 'XX';

        updateBikeImage();
    }

    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            const colorType = this.parentElement.id.replace('-options', '').replace('-colors', '');
            if (colorType !== 'layer0' && colorType !== 'layer6') {
                bikeColors[colorType] = this.dataset.color.split('-')[0];
                setActiveOption(this.parentElement.querySelectorAll('.color-option'), this);
                updateBikeImage();
            }
        });
    });

    // Initial update
    resetCustomization();

});
