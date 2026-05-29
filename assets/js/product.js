// AREA DE DESCRIÇÃO
let descButton = document.querySelector('[data-desc-toggle]');
let descBody = document.querySelector('[data-desc-body]');

descButton.addEventListener('click', () => {
    descBody.classList.toggle('hidden');
});
