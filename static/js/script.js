document.addEventListener('DOMContentLoaded', function() {
    const colorOptions = document.querySelectorAll('.color-option');
    const acceptBtn = document.getElementById('accept-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const resetBtn = document.getElementById('reset-btn');

    const colorMapping = {
        'C01': '#000000', // BLACK / BLACK EBONY
        'C02': '#FFFFFF', // WHITE / WHITE SNOW
        'C03': '#FF0000', // ROJO
        'C22': '#FFA500', // ORANGE
        'C34': '#FF69B4', // PINK
        'C62': '#0000FF', // BLUE
        'C75': '#008000', // GREEN
        'C83': '#FFFAFA', // SNOW WHITE
        'C84': '#DC143C', // CRIMSON
        'C86': '#4169E1', // ROYAL BLUE
        'C88': '#32CD32', // LIME GREEN
        'C93': '#1E90FF', // DODGER BLUE
        'C94': '#FFD700', // GOLD
        'C95': '#00FF00', // LIME
        'C105': '#1A1A1A', // DARK GRAY
    };

    const bikeColors = {
        layer0: 'XX',
        background: 'C105',
        color1: 'C105',
        color2: 'C01',
        graphic1: 'C01',
        graphic2: 'C01',
        layer6: 'XX'
    };

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
        bikeColors.background = 'C105';
        bikeColors.color1 = 'C105';
        bikeColors.color2 = 'C01';
        bikeColors.graphic1 = 'C01';
        bikeColors.graphic2 = 'C01';
        bikeColors.layer6 = 'XX';

        updateBikeImage();
    }

    // Initial update
    updateBikeImage();
});
