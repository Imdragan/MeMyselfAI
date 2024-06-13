document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category') || 'all';

    const filter = document.getElementById("category-filter");
    loadCategoryOptions(filter, category);
    filter.addEventListener("change", () => loadImages(filter.value));
    loadImages(category);
});

function loadCategoryOptions(filter, selectedCategory) {
    fetch('data_yolo.json')
        .then(response => response.json())
        .then(data => {
            const categories = new Set();
            data.forEach(item => {
                item.Objects.forEach(obj => {
                    categories.add(obj.label);
                });
            });

            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
                filter.appendChild(option);
            });

            if (selectedCategory !== 'all') {
                filter.value = selectedCategory;
            }
        })
        .catch(error => console.error('Error loading JSON:', error));
}

function loadImages(category) {
    fetch('data_yolo.json')
        .then(response => response.json())
        .then(data => {
            const grid = document.getElementById('image-grid');
            grid.innerHTML = ''; // Clear previous images

            data.forEach(item => {
                item.Objects.forEach(obj => {
                    if (category === "all" || obj.label === category) {
                        const imgElement = document.createElement('img');
                        imgElement.src = `/img_500/${item.FileName}${item.FileExtension}`; // Adjust this path based on your folder structure
                        imgElement.alt = `Image with DateTimeOriginal: ${item.DateTimeOriginal}`;
                        grid.appendChild(imgElement);
                    }
                });
            });
        })
        .catch(error => console.error('Error loading JSON:', error));
}
