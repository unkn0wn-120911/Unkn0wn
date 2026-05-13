const router = {
  handleRoute() {
    const hash = window.location.hash || '#home';
    document.querySelectorAll('main > section').forEach(sec => sec.classList.add('hidden'));
    const target = document.querySelector(hash);
    if (target) target.classList.remove('hidden');
  },
  navigate(route) {
    window.location.hash = route;
  }
};
