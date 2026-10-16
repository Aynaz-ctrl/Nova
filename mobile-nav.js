const sidebar = document.querySelector('.sidebar');

if (sidebar) {
  const backdrop = document.createElement('div');
  backdrop.className = 'mobile-nav-backdrop';
  document.body.append(backdrop);

  const mobileView = window.matchMedia('(max-width: 760px)');
  let touchStartX = 0;
  let touchStartY = 0;

  function closeMenu() {
    sidebar.classList.remove('is-open');
    backdrop.classList.remove('is-visible');
  }

  function openMenu() {
    if (!mobileView.matches) return;
    sidebar.classList.add('is-open');
    backdrop.classList.add('is-visible');
  }

  document.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  }, { passive: true });

  document.addEventListener('touchend', (event) => {
    const touch = event.changedTouches[0];
    const horizontalDistance = touch.clientX - touchStartX;
    const verticalDistance = Math.abs(touch.clientY - touchStartY);

    if (touchStartX >= window.innerWidth - 32 && horizontalDistance <= -70 && verticalDistance < 90) openMenu();
  }, { passive: true });

  sidebar.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  backdrop.addEventListener('click', closeMenu);
  mobileView.addEventListener('change', closeMenu);
}
