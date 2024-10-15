document.addEventListener('DOMContentLoaded', function() {
    const colorOptions = document.querySelectorAll('.color-option');
    const acceptBtn = document.getElementById('accept-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const resetBtn = document.getElementById('reset-btn');

    const bikeColors = {
        layer0: 'XX',
        background: 'C95-GREEN',
        color1: 'C105-BLACK',
        color2: 'C01-BLACK',
        graphic1: 'C01-BLACK',
        graphic2: 'C01-BLACK',
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
                bikeColors[colorType] = this.dataset.color;
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
        document.querySelector('#background-colors .color-option[data-color="C95-GREEN"]').classList.add('active');
        document.querySelector('#color1-options .color-option:first-child').classList.add('active');
        document.querySelector('#color2-options .color-option:first-child').classList.add('active');
        document.querySelector('#graphic1-options .color-option:first-child').classList.add('active');
        document.querySelector('#graphic2-options .color-option:first-child').classList.add('active');

        // Reset bikeColors object
        bikeColors.layer0 = 'XX';
        bikeColors.background = 'C95-GREEN';
        bikeColors.color1 = 'C105-BLACK';
        bikeColors.color2 = 'C01-BLACK';
        bikeColors.graphic1 = 'C01-BLACK';
        bikeColors.graphic2 = 'C01-BLACK';
        bikeColors.layer6 = 'XX';

        updateBikeImage();
    }

    // Initial update
    updateBikeImage();
});
