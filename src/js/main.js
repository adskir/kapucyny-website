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

// Dropdown tap-to-open on mobile: the caret button toggles the submenu,
// the link itself always navigates normally (both on mobile and desktop) —
// keeps behavior predictable instead of overloading one tap target with two jobs.
document.querySelectorAll('.nav-item').forEach(item => {
  const caret = item.querySelector('.nav-caret');
  if (!caret) return;
  caret.addEventListener('click', (e) => {
    e.preventDefault();
    item.classList.toggle('open');
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
