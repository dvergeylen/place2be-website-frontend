function createUrl(protocol, host, ...path) {
  const sanitized = (Array.isArray(path)
    ? path : [path]).map((s) => s.replace(/^\/+|\/+$/, ''));

  return `${protocol}//${host}/${sanitized.join('/')}`;
}

function getCookie(cookies, key) {
  const res = cookies.split(';').map((c) => c.split('=')).find(([k]) => k.trim() === key);
  return res ? res[1] : undefined;
}

/* Usage:
 * const res = await fetchData(url);
 * → res.status: 200, 400, ...
 * → res.statusText: 'Ok', 'Bad Request', ...
 * → await res.json(): Json body
 */
function fetchData(url) {
  // https://developer.mozilla.org/en-US/docs/Web/API/Response
  const csrf = getCookie(document.cookie, 'csrf_token');

  return fetch(url, {
    method: 'GET',
    credentials: 'include', // Includes jwt (unreachable from JS because httponly)
    headers: {
      Accept: 'application/json',
      ...(csrf && { 'x-csrf-token': csrf }), // Includes CSRF Token mitigation
    },
  });
}

function postFormData(url, data, method) {
  const csrf = getCookie(document.cookie, 'csrf_token');

  return fetch(url, {
    method: method || 'POST',
    credentials: 'include', // Includes jwt (unreachable because httponly)
    headers: {
      Accept: 'application/json',
      ...(csrf && { 'x-csrf-token': csrf }), // Includes CSRF Token mitigation
    },
    body: data,
  });
}

function postJsonData(token, url, data, method) {
  const csrf = getCookie(document.cookie, 'csrf_token');

  return fetch(url, {
    method: method || 'POST',
    credentials: 'include', // Includes jwt (unreachable because httponly)
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(csrf && { 'x-csrf-token': csrf }), // Includes CSRF Token mitigation
    },
    body: JSON.stringify(data),
  });
}

/* Navbar toggle */
function setNavbarToggle() {
  document.addEventListener('DOMContentLoaded', () => {
    const navbarBurger = document.querySelector('.navbar-burger');
    const navBarMenu = document.querySelector('.navbar-menu');

    navbarBurger.addEventListener('click', () => {
      if (navbarBurger.classList.contains('is-active')) {
        navbarBurger.classList.remove('is-active');
        navBarMenu.classList.remove('is-active');
      } else {
        navbarBurger.classList.add('is-active');
        navBarMenu.classList.add('is-active');
      }
    });
  });
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export {
  createUrl,
  fetchData,
  postFormData,
  postJsonData,
  getCookie,
  setNavbarToggle,
  capitalizeFirstLetter,
};
