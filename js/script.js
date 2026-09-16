// Cambiá este número por el WhatsApp real de Barber CPB, con código de país y sin signos.
const WHATSAPP_NUMBER = '50588888888';

const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const bookingForm = document.querySelector('#booking-form');
const formStatus = document.querySelector('#form-status');
const dateInput = document.querySelector('#date');
const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
const backToTop = document.querySelector('.back-to-top');

const today = new Date();
const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];
dateInput.min = localDate;

function closeMenu() {
  navMenu.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}

menuToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  document.body.classList.toggle('menu-open', isOpen);
});

document.querySelectorAll('.nav-menu a').forEach((link) => link.addEventListener('click', closeMenu));

document.querySelectorAll('[data-service]').forEach((link) => {
  link.addEventListener('click', () => {
    const serviceName = link.dataset.service;
    const serviceSelect = document.querySelector('#service');
    [...serviceSelect.options].forEach((option) => {
      if (option.textContent.startsWith(serviceName)) serviceSelect.value = option.value;
    });
  });
});

bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!bookingForm.checkValidity()) {
    bookingForm.reportValidity();
    formStatus.textContent = 'Completá los campos requeridos para continuar.';
    return;
  }

  const formData = new FormData(bookingForm);
  const selectedDate = new Date(`${formData.get('date')}T12:00:00`);
  const formattedDate = new Intl.DateTimeFormat('es-NI', { day: 'numeric', month: 'long', year: 'numeric' }).format(selectedDate);
  const extraMessage = formData.get('message') ? `\nMensaje: ${formData.get('message')}` : '';
  const message = `Hola, Barber CPB. Mi nombre es ${formData.get('name')} y quisiera reservar una cita para ${formData.get('service')} el día ${formattedDate} a las ${formData.get('time')}.${extraMessage}`;
  formStatus.textContent = 'Abriendo WhatsApp...';
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
});

document.querySelectorAll('.gallery-item').forEach((item) => {
  item.addEventListener('click', () => {
    const image = item.querySelector('img');
    lightboxImage.src = item.dataset.full;
    lightboxImage.alt = image.alt;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
  });
});

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('menu-open');
  lightboxImage.src = '';
}

document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeLightbox(); });

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

window.addEventListener('scroll', () => backToTop.classList.toggle('visible', window.scrollY > 500), { passive: true });
