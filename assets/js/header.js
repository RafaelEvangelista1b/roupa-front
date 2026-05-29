let menuBurger = document.querySelector('[data-menu-button]');
let headerMenu = document.querySelector('[data-header-menu]');
let menuIconOff = document.querySelector('[data-menu-icon-off]');
let menuIconOn = document.querySelector('[data-menu-icon-on]');

menuBurger.addEventListener('click', () => {
    let isOpen = !headerMenu.classList.contains('hidden');

    headerMenu.classList.toggle('hidden', isOpen);
    menuBurger.classList.toggle('bg-[#1D4FFE]', !isOpen);
    menuIconOff.classList.toggle('hidden', !isOpen);
    menuIconOn.classList.toggle('hidden', isOpen);
});
