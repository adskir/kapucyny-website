// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
if (reveals.length) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  reveals.forEach(r => obs.observe(r));
}

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navList = document.getElementById('navList');
if (navToggle && navList) {
  navToggle.addEventListener('click', () => navList.classList.toggle('open'));
}

// Dropdown tap-to-open on mobile
document.querySelectorAll('.nav-item').forEach(item => {
  const link = item.querySelector(':scope > .nav-link');
  const dropdown = item.querySelector('.nav-dropdown');
  if (!dropdown) return;
  link.addEventListener('click', (e) => {
    if (window.innerWidth <= 900) {
      e.preventDefault();
      item.classList.toggle('open');
    }
  });
});

// Netlify Forms success handling (progressive enhancement)
const vocForm = document.getElementById('vocForm');
if (vocForm) {
  vocForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const data = new FormData(vocForm);
    fetch('/', { method: 'POST', body: data })
      .then(() => {
        vocForm.style.display = 'none';
        const success = document.getElementById('successMsg');
        if (success) success.classList.add('show');
      })
      .catch(() => { vocForm.submit(); });
  });
}
