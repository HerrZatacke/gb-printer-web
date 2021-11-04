const fetchDumpRetry = (url, n) => (
  fetch(url)
    .then((res) => (
      res.blob()
        .then((blob) => ({
          blob,
          contentType: res.headers.get('content-type'),
          status: res.status,
          ok: res.ok,
        }))
    ))
    .catch((error) => {
      if (n <= 1) {
        throw error;
      }

      return fetchDumpRetry(url, n - 1);
    })
);

export default fetchDumpRetry;
