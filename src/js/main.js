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
  caret.setAttribute('aria-expanded', 'false');
  caret.addEventListener('click', (e) => {
    e.preventDefault();
    const willOpen = !item.classList.contains('open');
    // close any other open submenu so only one is expanded at a time
    document.querySelectorAll('.nav-item.open').forEach(other => {
      if (other !== item) {
        other.classList.remove('open');
        const c = other.querySelector('.nav-caret');
        if (c) c.setAttribute('aria-expanded', 'false');
      }
    });
    item.classList.toggle('open', willOpen);
    caret.setAttribute('aria-expanded', String(willOpen));
    caret.blur();
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
