const fetchDumpRetry = (url, n) => (
  fetch(url)
    .then((res) => {

      let headers = {};

      try {
        const keys = [...res.headers.keys()];
        keys.forEach((key) => {
          try {
            headers[key] = res.headers.get(key);
          } catch (error2) {
            headers[key] = error2.message;
          }
        });
      } catch (error) {
        headers = error.message;
      }

      return (
        res.blob()
          .then((blob) => ({
            blob,
            contentType: res.headers.get('content-type'),
            meta: {
              headers,
            },
            status: res.status,
            ok: res.ok,
          }))
      );
    })
    .catch((error) => {
      if (n <= 1) {
        throw error;
      }

      return fetchDumpRetry(url, n - 1);
    })
);

export default fetchDumpRetry;
