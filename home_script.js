document.addEventListener("DOMContentLoaded", () => {
    loadAllImages();
});

function loadAllImages() {
    fetch('data_yolo.json')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('container');
            data.forEach(item => {
                item.Objects.forEach(obj => {
                    const imgElement = document.createElement('img');
                    imgElement.classList.add('floating-image');
                    imgElement.src = '/img_100/' + item.FileName + item.FileExtension;
                    imgElement.alt = `Image with DateTimeOriginal: ${item.DateTimeOriginal}`;

                    imgElement.onerror = () => {
                        console.error('Failed to load image: ' + imgElement.src);
                    };

                    container.appendChild(imgElement);
                    animateElement(imgElement, container);
                });
            });
        })
        .catch(error => console.error('Error loading JSON:', error));
}

function animateElement(imgElement, container) {
    const radius = 150; // Raggio del cerchio interno dove si muovono le immagini
    const centerX = container.clientWidth / 2;
    const centerY = container.clientHeight / 2;

    function updatePosition() {
        const randomAngle = Math.random() * 2 * Math.PI;
        const randomRadius = Math.random() * radius;

        const x = centerX + randomRadius * Math.cos(randomAngle) - imgElement.width / 2;
        const y = centerY + randomRadius * Math.sin(randomAngle) - imgElement.height / 2;

        imgElement.style.left = `${x}px`;
        imgElement.style.top = `${y}px`;

        setTimeout(updatePosition, Math.random() * 2000 + 1000);
    }

    updatePosition();
}
