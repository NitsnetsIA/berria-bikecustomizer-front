
document.addEventListener('DOMContentLoaded', function() {

    const acceptBtn = document.getElementById('accept-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const resetBtn = document.getElementById('reset-btn');
    let layerImages = {};

    function updateLayers() {
        fetch('/get_images_list')
            .then(response => response.json())
            .then(data => {
                if (data.images) {
                    updateLayerSelectors(data.images);
                } else {
                    console.error('Error obteniendo la lista de imágenes:', data.error);
                }
            })
            .catch(error => console.error('Error al obtener la lista de imágenes:', error));
    }

    function updateLayerSelectors(images) {

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
        
                layers[bikeName][view][layer][color].push({
                    imageName: imageName,
                    finish: finish
                });
            }
            return layers;
        }, {});
        
        // Create a color selector for each layer
        for (let k = 0; k < Object.keys(layerImages['MAKO'][0]).length; k++) {

            bikeContainer = document.getElementById('bike-container');

            bikeContainer.innerHTML += `<img id="layer${k}" src="static/images/${layerImages['MAKO']['0'][k][Object.keys(layerImages['MAKO']['0'][k])[0]][0].imageName}" alt="Color 1" class="img-fluid position-absolute top-0 start-0">`;

            const bikeColors = Object.keys(layerImages['MAKO'][0][k]);
            layerHtml = '';
            layerHtml += `<div class="mb-3">`;

            if (bikeColors[0] === 'XX') {
                layerHtml += `<h3>Layer ${k} (Fixed)</h3>
                <p>This layer has a fixed color and cannot be customized.</p>`
            }else{

                layerHtml += `<h3> Layer ${k}</h3>`;
                layerHtml += `<div id="layer${k}-options" class="d-flex flex-wrap layer-options">`;

            for (let l = 0; l < bikeColors.length; l++) {

                color = colorCodes.find(color => color.code === bikeColors[l])
                const div = document.createElement('div');
                div.className = 'color-option';
                div.setAttribute('title', `${color.desc}`);
                div.setAttribute('data-color', `${color.code}`);
                div.setAttribute('data-layer', `${k}`);
                div.setAttribute('data-image', `static/images/${layerImages['MAKO']['0'][k][Object.keys(layerImages['MAKO']['0'][k])[l]][0].imageName}`);
                div.style.backgroundColor = color.hex; // Asignar el color hexadecimal

                if(l === 0)
                    div.classList.add('active');

                layerHtml += div.outerHTML;
                
            }}

            layerHtml += `</div>`;
            document.getElementById('layers-container').innerHTML += layerHtml;
        }


        // add click event for every color-option
        document.querySelectorAll('.color-option').forEach(option => {

            option.addEventListener('click', function() { 

                // remove active class from all other options
                this.parentElement.querySelectorAll('.color-option').forEach(option => option.classList.remove('active'));
                // set active class to clicked element
                this.classList.add('active');
                // get imageName from data-image attribute
                const imageName = this.getAttribute('data-image');
                // get layer from parent element
                const layer = this.getAttribute('data-layer');
                // update src image with new image
                document.getElementById(`layer${layer}`).src = `/${imageName}`;



            });
        });

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
            document.getElementById(`layer${layerNum}`).src = `/${imageName}`;



        });
    }

    // Initial update 
    updateLayers();



});
