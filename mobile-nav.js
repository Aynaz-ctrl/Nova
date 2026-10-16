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

  function recordStart(clientX, clientY) {
    touchStartX = clientX;
    touchStartY = clientY;
  }

  function revealFromSwipe(clientX, clientY) {
    const horizontalDistance = clientX - touchStartX;
    const verticalDistance = Math.abs(clientY - touchStartY);

    if (touchStartX >= window.innerWidth - 44 && horizontalDistance <= -55 && verticalDistance < 90) openMenu();
  }

  document.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'touch' && event.isPrimary) recordStart(event.clientX, event.clientY);
  }, { passive: true });

  document.addEventListener('pointerup', (event) => {
    if (event.pointerType === 'touch' && event.isPrimary) revealFromSwipe(event.clientX, event.clientY);
  }, { passive: true });

  document.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    recordStart(touch.clientX, touch.clientY);
  }, { passive: true });

  document.addEventListener('touchend', (event) => {
    const touch = event.changedTouches[0];
    revealFromSwipe(touch.clientX, touch.clientY);
  }, { passive: true });

  sidebar.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  backdrop.addEventListener('click', closeMenu);
  mobileView.addEventListener('change', closeMenu);
}
