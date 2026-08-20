// Grabs all sections and navigation links for scroll tracking
let sections = document.querySelectorAll('section');
let nav_links = document.querySelectorAll('header nav a');

// Runs on every scroll: updates active navigation link, sticky header, and closes mobile menu
window.onscroll = () => {
    // Highlights the navigation link for the section that is in view
    sections.forEach(sec => {
        let top = window.scrollY;            
        let offset = sec.offsetTop - 150;    
        let height = sec.offsetHeight;        
        let id = sec.getAttribute('id');      

        if(top >= offset && top < offset + height) {
            nav_links.forEach(links => {
                links.classList.remove('active');  
                const activeLink = document.querySelector('header nav a[href*=' + id + ']');
                if (activeLink) activeLink.classList.add('active');
            });
        };
    });

    // Adds background once the page scrolls past the top
    let header = document.querySelector('header');
    header.classList.toggle('sticky', window.scrollY > 100);

    // Closes the mobile navigation menu if it was open
    menu_icon.classList.remove('bx-x');
    nav_bar.classList.remove('active');
};

// Grabs the hamburger icon and mobile navigation menu
let menu_icon = document.querySelector('#menu-icon');
let nav_bar = document.querySelector('.nav-bar');

// Toggles the mobile navigation menu open/closed when the hamburger icon is clicked
menu_icon.onclick = () => {
    menu_icon.classList.toggle('bx-x');
    nav_bar.classList.toggle('active');
};

// Closes the mobile navigation menu as soon as a link is tapped
nav_links.forEach(link => {
    link.addEventListener('click', () => {
        menu_icon.classList.remove('bx-x');
        nav_bar.classList.remove('active');
    });
});

// Measures each project card's natural height so the grid slot reserves enough space
function setSlotHeights() {

    document.querySelectorAll('.projects-slot').forEach(slot => {
        const box = slot.querySelector('.projects-box');
        if (!box) return;  
        const prevPosition = box.style.position;
        const prevHeight   = box.style.height;

        box.style.position = 'relative';
        box.style.height   = 'auto';
        slot.style.height  = 'auto';

        const naturalHeight = box.offsetHeight;

        box.style.position = prevPosition || '';
        box.style.height   = prevHeight   || '';
        slot.style.height = naturalHeight + 'px';
    });
}

// Recalculates slot heights once the page finishes loading
window.addEventListener('load', setSlotHeights);

// Recalculates slot heights after resizing stops
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setSlotHeights, 150);
});

// Default settings for all scroll-reveal animations
ScrollReveal({ 
    reset: false,     
    distance: '30px',  
    duration: 900,     
    delay: 100         
});

// Fades in headings and hero content from the top for Home page
ScrollReveal().reveal('.home-content, .heading', { origin: 'top' });

// Fades in cards from the bottom as they scroll into view for
ScrollReveal().reveal('.skills-cards, .leadership-box, .projects-box, .experience-box, .contact-cards', { origin: 'bottom' });

// Fades in eyebrow labels from the left
ScrollReveal().reveal('.skills-header, .section-eyebrow', { origin: 'left' });

// Grabs all modal open/close triggers
const modalBtns = document.querySelectorAll('.projects-button, .experience-button');
const modalCloses = document.querySelectorAll('.projects__modal-close, .experience__modal-close');

// Remembers which button opened a modal so focus can return to it on close
let lastFocusedTrigger = null;

// Opens the matching modal and blur its section when a "View" button is clicked
modalBtns.forEach((modalBtn) => {
    modalBtn.addEventListener('click', () => {
        const modal = document.querySelector(modalBtn.dataset.modalTarget);
        lastFocusedTrigger = modalBtn;
        openModal(modal);
        modalBtn.closest('section').classList.add('blur');
    });
});

// Shared close routine: hide the modal, remove the blur, restore focus
function closeActiveModal(modal) {
    if (!modal) return;
    closeModal(modal);
    if (lastFocusedTrigger) {
        const section = lastFocusedTrigger.closest('section');
        if (section) section.classList.remove('blur');
        lastFocusedTrigger.focus();
        lastFocusedTrigger = null;
    }
}

// Closes the modal when the close icon is clicked
modalCloses.forEach((modalClose) => {
    modalClose.addEventListener('click', () => {
        const modal = modalClose.closest('.projects__modal') || modalClose.closest('.experience__modal');
        closeActiveModal(modal);
    });
});

// Closes the modal when clicking the dark overlay outside the content box
document.querySelectorAll('.projects__modal, .experience__modal').forEach(modalOverlay => {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            closeActiveModal(modalOverlay);
        }
    });
});

// Closes whichever modal is open when the Escape key is pressed
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const openModalEl = document.querySelector('.projects__modal.active-modal, .experience__modal.active-modal');
        closeActiveModal(openModalEl);
    }
});

// Recalculates slot heights after a modal finishes closing
document.querySelectorAll('.projects__modal, .experience__modal').forEach(m => {
    m.addEventListener('transitionend', () => {
        if (!m.classList.contains('active-modal')) setSlotHeights();
    });
});

// Shows a modal and locks page scroll via the modal-open class on html
function openModal(modal) {
    if (modal == null) return;   
    modal.classList.add('active-modal');
    document.documentElement.classList.add('modal-open');
}

// Hides a modal and restores page scroll
function closeModal(modal) {
    if (modal == null) return;
    modal.classList.remove('active-modal');
    document.documentElement.classList.remove('modal-open');
}

// Watches sections and marks them visible once they scroll into view
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');  
            sectionObserver.unobserve(entry.target);         
        }
    });
}, { threshold: 0.08 });  

// Starts observing every section for the scroll-reveal effect
document.querySelectorAll('section').forEach(sec => sectionObserver.observe(sec));