// Funzione per caricare e elaborare i dati dai file JSON
function loadData() {
    Promise.all([
        fetch('data_yolo.json').then(response => response.json()),
        fetch('data_images.json').then(response => response.json())
    ])
    .then(([dataYolo, dataImages]) => {
        const categories = [...new Set(dataYolo.flatMap(item => item.Objects.map(obj => obj.label)))]; // Estrae tutte le categorie dai dati YOLO

        const processedData = categories.map(category => {
            return processData(dataYolo, dataImages, category);
        });

        // Ordinare i dati in base al numero di immagini
        processedData.sort((a, b) => b.numImages - a.numImages);

        // Generare dinamicamente le righe HTML per ogni categoria
        const mainContainer = document.querySelector('main');
        mainContainer.innerHTML = ''; // Svuotare il contenitore principale

        let row;
        processedData.forEach((data, index) => {
            if (index % 2 === 0) {
                row = document.createElement('div');
                row.classList.add('row');
                mainContainer.appendChild(row);
            }
            createOuterBox(row, data);
        });
    })
    .catch(error => console.error('Error loading data:', error));
}

// Funzione per elaborare i dati per una specifica tipologia di immagine
function processData(dataYolo, dataImages, label) {
    const filteredData = dataYolo.filter(item => {
        return item.Objects.some(obj => obj.label === label);
    });

    const totalImages = dataImages.length;
    let dayCount = 0;
    let nightCount = 0;

    dataImages.forEach(item => {
        const hour = new Date(item.DateTimeOriginal).getHours();
        if (hour >= 6 && hour < 18) {
            dayCount++;
        } else {
            nightCount++;
        }
    });

    return {
        label: label,
        numImages: filteredData.length,
        totalImages: totalImages,
        dayCount: dayCount,
        nightCount: nightCount
    };
}

// Funzione per visualizzare le informazioni nel contenitore specificato
function displayInfo(container, data) {
    container.innerHTML = '';

    const titleElement = document.createElement('h2');
    titleElement.textContent = `Genere: ${data.label}`;
    container.appendChild(titleElement);

    const numImagesElement = document.createElement('p');
    numImagesElement.textContent = `Numero di immagini: ${data.numImages}`;
    container.appendChild(numImagesElement);

    const totalImagesElement = document.createElement('p');
    totalImagesElement.textContent = `Totale immagini database: ${data.totalImages}`;
    container.appendChild(totalImagesElement);
}

// Funzione per creare una nuova outer-box con le informazioni della categoria
function createOuterBox(row, data) {
    const outerBox = document.createElement('div');
    outerBox.classList.add('outer-box');

    const circleContainer = document.createElement('div');
    circleContainer.classList.add('circle-container');

    const infoBox = document.createElement('div');
    infoBox.classList.add('info-box');

    outerBox.appendChild(circleContainer);
    outerBox.appendChild(infoBox);
    row.appendChild(outerBox);

    // Visualizzare le informazioni nel box corrispondente
    displayInfo(infoBox, data);

    // Caricare le immagini e aggiungere animazioni
    loadCanvas(data.label, circleContainer);
}

// Funzione per caricare il JSON e aggiungere immagini al container
function loadCanvas(classe, container) {
    fetch('data_yolo.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const filteredData = data.filter(item => {
                return item.Objects.some(obj => obj.label === classe);
            });

            const imgPaths = filteredData.map(item => {
                return '/img_100/' + item.FileName + item.FileExtension;
            });

            // Creare un elemento img per ogni immagine
            imgPaths.forEach((img_path, index) => {
                const imgElement = document.createElement('img');
                imgElement.classList.add('floating-image');

                // Impostare l'attributo src dell'immagine
                imgElement.src = img_path;
                imgElement.alt = `Image with DateTimeOriginal: ${filteredData[index].DateTimeOriginal}`;

                imgElement.onerror = () => {
                    console.error('Failed to load image: ' + img_path);
                };

                container.appendChild(imgElement);
            });

            // Avvia l'animazione delle immagini nel container
            animateImages(container);
        })
        .catch(error => {
            console.error('Error loading JSON:', error);
        });
}

// Funzione per animare le immagini nel container
function animateImages(container) {
    const images = container.querySelectorAll('.floating-image');
    const radius = container.clientWidth / 2;

    images.forEach(imgElement => {
        function updatePosition() {
            const randomAngle = Math.random() * 2 * Math.PI;
            const x = radius * Math.cos(randomAngle);
            const y = radius * Math.sin(randomAngle);

            imgElement.style.transform = `translate(${x}px, ${y}px)`;

            setTimeout(updatePosition, Math.random() * 2000 + 1000);
        }

        updatePosition();
    });
}

// Caricare i dati quando il documento è pronto
document.addEventListener('DOMContentLoaded', loadData);
