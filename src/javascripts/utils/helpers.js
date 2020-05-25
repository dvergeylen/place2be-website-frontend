function path2url(path) {
  const sanitized = (Array.isArray(path)
    ? path : [path]).map((s) => s.replace(/^\/+/, ''));

  return `${window.location.protocol}//${window.location.host}/${sanitized.join('/')}`;
}

/* Usage:
 * const res = await fetchData(token, url);
 * → res.status(): 200, 400, ...
 * → res.statusText(): 'Ok', 'Bad Request', ...
 * → await res.json(): Json body
 */
function fetchData(token, url) {
  // https://developer.mozilla.org/en-US/docs/Web/API/Response
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export {
  path2url,
  fetchData,
};
