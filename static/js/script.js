document.addEventListener('DOMContentLoaded', function() {
    const colorOptions = document.querySelectorAll('.color-option');
    const finishOptions = document.querySelectorAll('.finish-option');
    const acceptBtn = document.getElementById('accept-btn');
    const cancelBtn = document.getElementById('cancel-btn');

    const bikeColors = {
        background: 'C01-BLACK',
        finish: 'Mate',
        color1: 'C01-BLACK',
        color2: 'C01-BLACK',
        graphic1: 'C01-BLACK',
        graphic2: 'C01-BLACK'
    };

    function updateBikeImage() {
        // In a real application, you would update the bike image layers here
        // For this example, we'll just log the current configuration
        console.log('Current bike configuration:', bikeColors);
    }

    function setActiveOption(options, selectedOption) {
        options.forEach(option => option.classList.remove('active'));
        selectedOption.classList.add('active');
    }

    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            const colorType = this.parentElement.id.replace('-options', '');
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
        document.querySelector('#background-colors .color-option:nth-child(5)').classList.add('active');
        document.querySelector('#finish-options .finish-option:first-child').classList.add('active');
        document.querySelector('#color1-options .color-option:first-child').classList.add('active');
        document.querySelector('#color2-options .color-option:first-child').classList.add('active');
        document.querySelector('#graphic1-options .color-option:first-child').classList.add('active');
        document.querySelector('#graphic2-options .color-option:first-child').classList.add('active');

        // Reset bikeColors object
        Object.keys(bikeColors).forEach(key => bikeColors[key] = 'C01-BLACK');
        bikeColors.finish = 'Mate';

        updateBikeImage();
    });

    // Initial update
    updateBikeImage();
});
