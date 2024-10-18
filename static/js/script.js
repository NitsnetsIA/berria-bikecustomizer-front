
document.addEventListener('DOMContentLoaded', function() {

    const acceptBtn = document.getElementById('accept-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const resetBtn = document.getElementById('reset-btn');
    let imagesCND = '';

    // if current domain is berria-bikecustomizer.servidorbeta.com uses CND images if not put '' on imagesCND
    if (window.location.hostname === 'berria-bikecustomizer-front.servidorbeta.com') {
        const imagesCND = 'https://cdn-berria-bikecustomizer.static-servidorbeta.com/cdn-cgi/image/width=800,height=800,quality=90/';}
  
    let layerImages = {};
    let currentBike = 'MAKO';
    let currentFinish = 'XX';


    function getImageName(finish, layer, color) {
        if (!layerImages[currentBike]) {
            console.error(`Bicicleta "${currentBike}" no encontrada.`);
            return null;
        }
    
        const views = Object.keys(layerImages[currentBike]);
        if (views.length === 0 || !layerImages[currentBike][views[0]][layer]) {
            console.error(`Capa "${layer}" no encontrada para la bicicleta "${currentBike}".`);
            return null;
        }
    
        // Busca la imagen con el color y el acabado proporcionado
        if (layerImages[currentBike][views[0]][layer][color]) {
            const imageObject = layerImages[currentBike][views[0]][layer][color].find(img => img.finish === finish);
            if (imageObject) {
                return imageObject.imageName;
            }
        }
    
        // Si no encuentra la imagen con el acabado proporcionado, devuelve la del acabado 'XX'
        if (layerImages[currentBike][views[0]][layer][color]) {
            const imageObject = layerImages[currentBike][views[0]][layer][color].find(img => img.finish === 'XX');
            if (imageObject) {
                return imageObject.imageName;
            }
        }
    
        console.error(`Imagen con el acabado "${finish}" y color "${color}" no encontrada para la capa "${layer}".`);
        return null;
    }
    
    

    function updateBikes() {
        fetch('/get_images_list')
            .then(response => response.json())
            .then(data => {
                if (data.images) {
                    loadLayersImages(data.images);
                } else {
                    console.error('Error obteniendo la lista de imágenes:', data.error);
                }
            })
            .catch(error => console.error('Error al obtener la lista de imágenes:', error));
    }


    function loadLayersImages(images) {

        layerImages = images.reduce((layers, imageName) => {
            const parts = imageName.split('-');
            if (parts.length >= 6) {
                const bikeName = parts[0];
                const view = parts[1];
                const layer = parts[2];
                const color = parts[3];
                const finish = parts[4];
                
                if (!layers[bikeName]) {
                    layers[bikeName] = {};
                }
                if (!layers[bikeName][view]) {
                    layers[bikeName][view] = {};
                }
                if (!layers[bikeName][view][layer]) {
                    layers[bikeName][view][layer] = {};
                }
                if (!layers[bikeName][view][layer][color]) {
                    layers[bikeName][view][layer][color] = [];
                }
                
                colorSearch = color;
                colorData = colorCodes.find(color => color.code == colorSearch)

                layers[bikeName][view][layer][color].push({
                    imageName: imageName,
                    hex: colorData.hex,
                    desc: colorData.desc,
                    code: color,
                    finish: finish
                });
            }
            return layers;
        }, {});

// Function to sort by color code number
function sortByColorCode(layers) {
    Object.keys(layers).forEach(bikeName => {
        Object.keys(layers[bikeName]).forEach(view => {
            Object.keys(layers[bikeName][view]).forEach(layer => {
                const sortedColors = Object.keys(layers[bikeName][view][layer])
                    .sort((a, b) => {
                        const numA = parseInt(a.slice(1));
                        const numB = parseInt(b.slice(1));
                        return numA - numB;
                    })
                    .reduce((acc, key) => {
                        acc[key] = layers[bikeName][view][layer][key];
                        return acc;
                    }, {});
                layers[bikeName][view][layer] = sortedColors;
            });
        });
    });
}

// Sort layerImages by rainbow color order
sortByColorCode(layerImages);

    updateBikeSelector();
    updateFinishSelectors();
    updateLayerSelectors();

    }

    function updateBikeSelector() {

           // Create a combo box for selecting the bike
           const bikes = Object.keys(layerImages);
           let bikeHtml = '';
           bikeHtml += `<select id="bike-select" class="form-select">`;
           for (let i = 0; i < bikes.length; i++) {
               bikeHtml += `<option value="${bikes[i]}">${bikes[i]}</option>`;
           }
           bikeHtml += `</select>`;
           document.getElementById('bike-combobox').innerHTML = bikeHtml;

           // Set current bike to the first one
              currentBike = bikes[0];
              document.getElementById('bike-title').innerText = currentBike;
   
           // Add event listener for bike select
           document.getElementById('bike-select').addEventListener('change', function() {
               currentBike = this.value;
           
           // set bike-title
           document.getElementById('bike-title').innerText = currentBike;
           
            // Update finishes selector
           updateFinishSelectors();
           updateLayerSelectors();
           
            });
    }   


    function getFinishesForBike(bikeName) {
        const finishes = new Set();
    
        if (layerImages[bikeName]) {
            Object.keys(layerImages[bikeName]).forEach(view => {
                Object.keys(layerImages[bikeName][view]).forEach(layer => {
                    Object.keys(layerImages[bikeName][view][layer]).forEach(color => {
                        layerImages[bikeName][view][layer][color].forEach(imageData => {
                            finishes.add(imageData.finish);
                        });
                    });
                });
            });
        } else {
            console.error(`Bicicleta "${bikeName}" no encontrada.`);
        }
    
        return Array.from(finishes);
    }

    function applyActiveColorsToLayers() {
        document.querySelectorAll('.color-option.active').forEach(option => {
            // Obtener el nombre de la imagen del atributo data-image
            const imageName = option.getAttribute('data-image');
            // Obtener el índice de la capa desde el atributo data-layer
            const layerIndex = option.getAttribute('data-layer');
            // Actualizar el src de la imagen correspondiente en el bike-container
            const layerImageElement = document.getElementById(`layer${layerIndex}`);
            
            if (layerImageElement) {
                layerImageElement.src = imageName;
            } else {
                console.error(`Elemento de la capa ${layerIndex} no encontrado en el contenedor de la bicicleta.`);
            }
        });
    }

    function saveActiveColors() {
        const activeColors = [];
    
        document.querySelectorAll('.color-option.active').forEach(option => {
            const color = option.getAttribute('data-color');
            const layer = parseInt(option.getAttribute('data-layer'));
    
            activeColors.push({
                layer: layer,
                color: color
            });
        });
    
        return activeColors;
    }
    
    function restoreActiveColors(activeColors) {
        // Primero, eliminar la clase 'active' de todas las opciones de color
        document.querySelectorAll('.color-option.active').forEach(option => {
            option.classList.remove('active');
        });
    
        // Luego, recorrer el array de colores activos guardados y aplicar la clase 'active'
        activeColors.forEach(item => {
            const layer = item.layer;
            const color = item.color;
    
            const optionToActivate = document.querySelector(`.color-option[data-layer="${layer}"][data-color="${color}"]`);
            if (optionToActivate) {
                optionToActivate.classList.add('active');
                // Actualizar la imagen de la capa correspondiente en el bike-container
                const imageName = optionToActivate.getAttribute('data-image');
                const layerImageElement = document.getElementById(`layer${layer}`);
                if (layerImageElement) {
                    layerImageElement.src = `${imageName}`;
                }
            } else {
                console.error(`No se encontró la opción de color para la capa ${layer} con el color ${color}`);
            }
        });
    }
    
    
 
    function updateLayerSelectors(holdActiveColors = false) {

        // Save active colors before updating the layer selectors if holdActiveColors is true
        let activeColors = [];
        if (holdActiveColors) {
            activeColors = saveActiveColors();
        }

        // Clear layers and bike containers
        document.getElementById('layers-container').innerHTML = '';
        document.getElementById('bike-container').innerHTML = '';
   
        // Create a color selector for each layer
        for (let k = 0; k < Object.keys(layerImages[currentBike][0]).length; k++) {

            const bikeColors = Object.keys(layerImages[currentBike][0][k]);
            const bikeContainer = document.getElementById('bike-container');

            if(bikeColors[0] === 'XX')
                imageSrc = imagesCND+`static/images/${getImageName(currentFinish, k, bikeColors[0])}`;
            else
                imageSrc = ``;

            bikeContainer.innerHTML += `<img id="layer${k}" src="${imageSrc}" alt="Color 1" class="img-fluid position-absolute top-0 start-0">`;
    
            let layerHtml = '';
            layerHtml += `<div class="mb-3">`;
    
            if (bikeColors[0] === 'XX') {
                layerHtml += `<h3>Layer ${k} (Fixed)</h3>
                <p>This layer has a fixed color and cannot be customized.</p>`;
            } else {
                layerHtml += `<h3>Layer ${k}</h3>`;
                layerHtml += `<div id="layer${k}-options" class="d-flex flex-wrap layer-options">`;

                for (let l = 0; l < bikeColors.length; l++) {
                    const color = colorCodes.find(color => color.code === bikeColors[l]);
                    const div = document.createElement('div');
                    div.className = 'color-option';
                    div.setAttribute('title', `${color.desc}`);
                    div.setAttribute('data-color', `${color.code}`);
                    div.setAttribute('data-layer', `${k}`);
                    div.setAttribute('data-image', imagesCND+`static/images/${getImageName(currentFinish, k, bikeColors[l])}`);
                    div.style.backgroundColor = color.hex; // Asignar el color hexadecimal
    
                    if (l === 0) {
                        div.classList.add('active');
                    }
    
                    layerHtml += div.outerHTML;
                }
            }
    
            layerHtml += `</div>`;
            document.getElementById('layers-container').innerHTML += layerHtml;

            // restore active colors if holdActiveColors is true
            if (holdActiveColors) {
                restoreActiveColors(activeColors);
            }

            applyActiveColorsToLayers();

        }
    
        // Add click event for every color-option
        document.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', function() {
                // Remove active class from all other options
                this.parentElement.querySelectorAll('.color-option').forEach(option => option.classList.remove('active'));
                // Set active class to clicked element
                this.classList.add('active');
                // Get imageName from data-image attribute
                const imageName = this.getAttribute('data-image');
                // Get layer from parent element
                const layer = this.getAttribute('data-layer');
                // Update src image with new image
                document.getElementById(`layer${layer}`).src = `${imageName}`;
            });
        });

    }

    function updateFinishSelectors() {

        // Get finishes for current bike
        const finishes = getFinishesForBike(currentBike).filter(finish => finish !== 'XX');

        // Return first finish that is not 'XX', or return 'XX' if all finishes are 'XX'
        currentFinish = finishes[0] || 'XX';
    
        // Add finishes selector if there are 2 or more finishes (excluding 'XX')
        document.getElementById('finishes-container').innerHTML = '';

        if (finishes.length >= 2) {
            let finishHtml = '';
            finishHtml += `<div class="mb-3"><h3>Finishes</h3>`;
            finishHtml += `<div id="finish-options" class="d-flex flex-wrap layer-options">`;
    
            for (let finish of finishes) {
                const div = document.createElement('div');
                div.className = 'finish-option';
                div.setAttribute('data-finish', finish);
                div.textContent = finish; // Display the finish name
    
                if (finish === currentFinish) {
                    div.classList.add('active');
                }
    
                finishHtml += div.outerHTML;
            }
    
            finishHtml += `</div></div>`;
            document.getElementById('finishes-container').innerHTML += finishHtml;
  
            // Add click event for every finish-option
            document.querySelectorAll('.finish-option').forEach(option => {

                option.addEventListener('click', function() {

                    // Remove active class from all other finish options
                    document.querySelectorAll('.finish-option').forEach(option => option.classList.remove('active'));
                    // Set active class to clicked element
                    this.classList.add('active');
                    // Update current finish
                    currentFinish = this.getAttribute('data-finish');
                    // Update layer selectors with the new finish and hold active colors
                    updateLayerSelectors(true);

                });
            });


        }
    }
    
 
    resetBtn.addEventListener('click', resetCustomization);

    function resetCustomization() {
        document.querySelectorAll('.color-option').forEach(option => {
            if (option.classList.contains('active')) {
                option.classList.remove('active');
            }
        });

        document.querySelectorAll('.layer-options').forEach(layer => {
            layer.querySelector('.color-option').classList.add('active');
            // get imageName from data-image attribute
            const imageName = layer.querySelector('.color-option').getAttribute('data-image');
            // get layer from parent element
            const layerNum = layer.querySelector('.color-option').getAttribute('data-layer');
            // update src image with new image
            document.getElementById(`layer${layerNum}`).src = imageName;



        });
    }

    // Initial update 
    updateBikes();

});
