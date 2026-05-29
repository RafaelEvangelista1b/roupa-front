let footerBtn = document.querySelector('[data-scroll-top]');

footerBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });
});
