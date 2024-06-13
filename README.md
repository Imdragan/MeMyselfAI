SUPSI 2023-24
Corso d’interaction design, CV428.01
Docenti: A. Gysin, G. Profeta

Elaborato 1: XL

# Me, Myself and AI

Autore: Dragan Radic
[Me, Myself and AI](https://imdragan.github.io/MeMyselfAI/)

## Introduzione e tema

Questo progetto si concentra sulla creazione di un'interfaccia web interattiva per la visualizzazione e l'animazione di immagini categorizzate. L'obiettivo principale è quello di mostrare visivamente le informazioni estratte da un dataset JSON contenente annotazioni di oggetti rilevati nelle immagini.

## Riferimenti progettuali

Il progetto è ispirato a un'applicazione web didattica per la visualizzazione dinamica di immagini categorizzate tramite tecnologie web moderne. L'interfaccia utente è progettata per essere intuitiva, con un layout flessibile che si adatta a diversi dispositivi.

## Design dell’interfraccia e modalià di interazione

L'interfaccia è divisa in sezioni, ciascuna dedicata a una categoria specifica di oggetti rilevati nelle immagini. Ogni sezione include:

Un riquadro contenente un cerchio centrale che visualizza le immagini in modo dinamico.
Informazioni testuali sulla categoria di immagini.
Navigazione semplice attraverso pulsanti per altre sezioni e per tornare alla homepage.
Il design è minimalista, con colori neutri per favorire la leggibilità e l'attenzione sul contenuto visivo.


## Tecnologia usata

Il progetto fa largo uso delle seguenti tecnologie:

HTML e CSS: Per la struttura e lo stile dell'interfaccia utente.
JavaScript: Per la manipolazione dinamica del DOM e per gestire l'animazione delle immagini.
Fetch API: Per recuperare e caricare dati da file JSON contenenti informazioni sugli oggetti rilevati nelle immagini.
Responsive Design: Layout adattabile per supportare una varietà di dimensioni schermo e dispositivi.

## Parti di codice rilevanti per il progetto

Ecco un esempio di codice significativo per l'animazione delle immagini all'interno del cerchio:

// Funzione per caricare il JSON e aggiungere animazioni alle immagini
function loadCanvas(classe, containerId) {
    const container = document.getElementById(containerId);

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

            // Calcola le dimensioni del cerchio e delle immagini
            const radius = Math.min(container.clientWidth, container.clientHeight) / 2;
            const centerX = container.clientWidth / 2;
            const centerY = container.clientHeight / 2;
            const angleIncrement = (2 * Math.PI) / imgPaths.length;
            const imgWidth = 50; // Larghezza delle immagini (da adattare secondo necessità)
            const imgHeight = 50; // Altezza delle immagini (da adattare secondo necessità)

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

                // Posizionare l'immagine lungo il perimetro del cerchio
                const angle = angleIncrement * index;
                const x = centerX + radius * Math.cos(angle) - imgWidth / 2;
                const y = centerY + radius * Math.sin(angle) - imgHeight / 2;

                imgElement.style.position = 'absolute';
                imgElement.style.left = `${x}px`;
                imgElement.style.top = `${y}px`;

                // Animazione delle immagini
                function animateElement() {
                    const randomAngle = angle + Math.random() * 0.5 - 0.25; // Angolo casuale vicino all'angolo originale
                    const x = centerX + radius * Math.cos(randomAngle) - imgWidth / 2;
                    const y = centerY + radius * Math.sin(randomAngle) - imgHeight / 2;

                    imgElement.style.left = `${x}px`;
                    imgElement.style.top = `${y}px`;

                    setTimeout(animateElement, Math.random() * 2000 + 1000); // Aggiusta questo valore per controllare la frequenza dell'aggiornamento
                }

                // Inizia l'animazione
                animateElement();
            });
        })
        .catch(error => {
            console.error('Error loading JSON:', error);
        });
}




## Contesto d’uso e Target

Questo progetto è destinato a essere utilizzato come strumento educativo interattivo per l'apprendimento dei sistemi di visione artificiale e per la visualizzazione dinamica di dataset annotati. È ideale per studenti, ricercatori e appassionati di intelligenza artificiale che desiderano esplorare e comprendere il processo di rilevamento degli oggetti in immagini.

