let infoShown = '';
let infoButtons = document.querySelectorAll('[data-info-button]');
let orderArea = document.querySelector('[data-order-area]');
let filtersArea = document.querySelector('[data-filters-area]');

infoButtons.forEach((item) => {
    item.addEventListener('click', () => {
        let name = item.getAttribute('data-name');
        if (name === infoShown) {
            infoShown = '';
        } else {
            infoShown = name;
        }
        renderInfo();
    });
})

function renderInfo() {
    orderArea.classList.add('hidden');
    filtersArea.classList.add('hidden');

    switch (infoShown) {
        case 'order':
            orderArea.classList.remove('hidden');
            break;
        case 'filter':
            filtersArea.classList.remove('hidden');
            break;
    }
}

// AREA DO FILTRO
let filterIcons = document.querySelectorAll('[data-filter-toggle]');
filterIcons.forEach(item => {
    item.addEventListener('click', () => {
        let body = item.closest('.mb-8').querySelector('[data-filter-body]');
        body.classList.toggle('hidden');
    });
});
