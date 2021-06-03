const getParams = () => {
  if (window.location.hash?.length <= 1) {
    return {};
  }

  const hash = window.location.hash.substr(1);
  return Object.fromEntries(new URLSearchParams(hash));
};

export default getParams;
