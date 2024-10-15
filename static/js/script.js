document.addEventListener('DOMContentLoaded', function() {
    const colorOptions = document.querySelectorAll('.color-option');
    const finishOptions = document.querySelectorAll('.finish-option');
    const acceptBtn = document.getElementById('accept-btn');
    const cancelBtn = document.getElementById('cancel-btn');

    const bikeColors = {
        background: 'C95-GREEN',
        finish: 'Mate',
        color1: 'C01-BLACK',
        color2: 'C01-BLACK',
        graphic1: 'C01-BLACK',
        graphic2: 'C01-BLACK'
    };

    function updateBikeImage() {
        const parts = {
            background: '0-1',
            color1: '0-2',
            color2: '0-3',
            graphic1: '0-4',
            graphic2: '0-5'
        };

        Object.keys(parts).forEach(part => {
            const imgElement = document.getElementById(`${part}-layer`);
            if (imgElement) {
                const colorCode = bikeColors[part].split('-')[0];
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
            bikeColors[colorType] = this.dataset.color;
            setActiveOption(this.parentElement.querySelectorAll('.color-option'), this);
            updateBikeImage();
        });
    });

    finishOptions.forEach(option => {
        option.addEventListener('click', function() {
            bikeColors.finish = this.dataset.finish;
            setActiveOption(finishOptions, this);
            updateBikeImage();
        });
    });

    acceptBtn.addEventListener('click', function() {
        alert('Customization accepted!');
        // Here you would typically send the configuration to a server or perform further actions
    });

    cancelBtn.addEventListener('click', function() {
        // Reset all options to default
        colorOptions.forEach(option => option.classList.remove('active'));
        finishOptions.forEach(option => option.classList.remove('active'));
        document.querySelector('#background-colors .color-option[data-color="C95-GREEN"]').classList.add('active');
        document.querySelector('#finish-options .finish-option:first-child').classList.add('active');
        document.querySelector('#color1-options .color-option:first-child').classList.add('active');
        document.querySelector('#color2-options .color-option:first-child').classList.add('active');
        document.querySelector('#graphic1-options .color-option:first-child').classList.add('active');
        document.querySelector('#graphic2-options .color-option:first-child').classList.add('active');

        // Reset bikeColors object
        bikeColors.background = 'C95-GREEN';
        bikeColors.finish = 'Mate';
        bikeColors.color1 = 'C01-BLACK';
        bikeColors.color2 = 'C01-BLACK';
        bikeColors.graphic1 = 'C01-BLACK';
        bikeColors.graphic2 = 'C01-BLACK';

        updateBikeImage();
    });

    // Initial update
    updateBikeImage();
});
