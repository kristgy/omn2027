/* OMN 2027 Stockholm Conference - Interactive Features */

// Staging & Preview Mode Configuration
const PREVIEW_MODE = true; // Set to false when officially launching public site!
const PREVIEW_PASSCODE = "OMN2027"; // Change this to your committee password

document.addEventListener('DOMContentLoaded', () => {
  initPasscodeProtection();
  initCountdown();
  initHeroSlideshow();
  initNavigation();
  initLightbox();
  initCalendarGenerator();
  initSubscribeForm();
});

/* ----------------------------------------------------
   0. Preview Passcode Protection (Staging Review)
---------------------------------------------------- */
function initPasscodeProtection() {
  const modal = document.getElementById('passcode-modal');
  const form = document.getElementById('passcode-form');
  const input = document.getElementById('passcode-input');
  const errorEl = document.getElementById('passcode-error');
  const box = document.querySelector('.passcode-box');

  if (!modal) return;

  // Check if preview mode is disabled or user already authenticated in session
  if (!PREVIEW_MODE || sessionStorage.getItem('omn2027_preview_unlocked') === 'true') {
    modal.classList.add('unlocked');
    return;
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const entered = input.value.trim();

      if (entered === PREVIEW_PASSCODE) {
        sessionStorage.setItem('omn2027_preview_unlocked', 'true');
        modal.classList.add('unlocked');
      } else {
        errorEl.style.display = 'block';
        if (box) {
          box.classList.add('shake');
          setTimeout(() => box.classList.remove('shake'), 400);
        }
        input.value = '';
        input.focus();
      }
    });
  }
}


/* ----------------------------------------------------
   1. Live Countdown Timer (Target: June 20, 2027 09:00:00)
---------------------------------------------------- */
function initCountdown() {
  const targetDate = new Date('2027-06-20T09:00:00+02:00').getTime();
  
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-minutes');
  const secsEl = document.getElementById('cd-seconds');

  if (!daysEl) return;

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      daysEl.textContent = '000';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(3, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(minutes).padStart(2, '0');
    secsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ----------------------------------------------------
   2. Hero Background Slideshow with Photographer Credits
---------------------------------------------------- */
function initHeroSlideshow() {
  const slides = document.querySelectorAll('.hero-slide');
  const creditTextEl = document.getElementById('hero-credit-text');
  if (slides.length === 0) return;

  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    
    // Update photographer credit text
    const activeCredit = slides[index].getAttribute('data-credit');
    if (creditTextEl && activeCredit) {
      creditTextEl.textContent = activeCredit;
    }
  }

  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }, 5000);
}

/* ----------------------------------------------------
   3. Sticky Navigation & Mobile Menu Toggle
---------------------------------------------------- */
function initNavigation() {
  const header = document.getElementById('site-header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  const links = document.querySelectorAll('.nav-links a');

  // Sticky header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll spy active highlight
    let current = '';
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile menu drawer toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (navLinks.classList.contains('active')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    });

    // Close menu when clicking a nav link
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });
  }
}

/* ----------------------------------------------------
   4. Lightbox Gallery Viewer with Photo Credits
---------------------------------------------------- */
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbCreditText = document.getElementById('lb-credit-text');
  const lbClose = document.getElementById('lb-close');
  const lbPrev = document.getElementById('lb-prev');
  const lbNext = document.getElementById('lb-next');

  if (!lightbox || galleryItems.length === 0) return;

  let currentIndex = 0;
  const itemsArray = Array.from(galleryItems);

  function openLightbox(index) {
    currentIndex = index;
    const item = itemsArray[currentIndex];
    const fullSrc = item.getAttribute('data-full');
    const credit = item.getAttribute('data-credit');

    lbImg.src = fullSrc;
    lbCreditText.textContent = credit;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % itemsArray.length;
    openLightbox(currentIndex);
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + itemsArray.length) % itemsArray.length;
    openLightbox(currentIndex);
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbNext) lbNext.addEventListener('click', showNext);
  if (lbPrev) lbPrev.addEventListener('click', showPrev);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
}

/* ----------------------------------------------------
   5. ICS Calendar Event File Download
---------------------------------------------------- */
function initCalendarGenerator() {
  const calBtn = document.getElementById('calendar-btn');
  if (!calBtn) return;

  calBtn.addEventListener('click', () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//OMN 2027 Committee//NONSGML Conference Calendar//EN',
      'BEGIN:VEVENT',
      'SUMMARY:OMN 2027 - International Conference on Optical MEMS and Nanophotonics',
      'DESCRIPTION:International Conference on Optical MEMS and Nanophotonics (OMN 2027) in Stockholm, Sweden.',
      'LOCATION:Stockholm, Sweden',
      'DTSTART:20270620T090000Z',
      'DTEND:20270624T180000Z',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'OMN_2027_Stockholm.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('OMN 2027 event added to your downloads! (.ics)');
  });
}

/* ----------------------------------------------------
   6. Subscribe Form & Toast Notification
---------------------------------------------------- */
function initSubscribeForm() {
  const form = document.getElementById('subscribe-form');
  const emailInput = document.getElementById('email-input');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (emailInput && emailInput.value) {
      showToast(`Thank you! ${emailInput.value} subscribed to OMN 2027 updates.`);
      emailInput.value = '';
    }
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');
  if (!toast || !toastText) return;

  toastText.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}
