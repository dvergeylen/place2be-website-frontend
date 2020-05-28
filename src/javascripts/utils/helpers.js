function path2url(path) {
  const sanitized = (Array.isArray(path)
    ? path : [path]).map((s) => s.replace(/^\/+/, ''));

  return `${window.location.protocol}//${window.location.host}/${sanitized.join('/')}`;
}

function getCookie(cookies, key) {
  const res = cookies.split(';').map((c) => c.split('=')).find(([k,]) => k.trim() === key);
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

// function postFormData(token, url, data, method) {
//   return fetch(url, {
//     method: method || 'POST',
//     headers: {
//       Authorization: `Bearer ${token}`,
//       Accept: 'application/json',
//     },
//     body: data,
//   });
// }

// function postJsonData(token, url, data, method) {
//   return fetch(url, {
//     method: method || 'POST',
//     headers: {
//       Authorization: `Bearer ${token}`,
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
//   });
// }

export {
  path2url,
  fetchData,
  postFormData,
  postJsonData,
  getCookie,
};
