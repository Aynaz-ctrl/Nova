if (!sessionStorage.getItem('aynovaSessionStarted')) {
  for (let index = localStorage.length - 1; index >= 0; index -= 1) {
    const key = localStorage.key(index);
    if (key?.startsWith('aynova')) localStorage.removeItem(key);
  }

  window.location.replace('signup.html?v=8');
}
