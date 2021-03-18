const setClasses = ({ isIframe, isPopup }) => {
  const classList = document.querySelector('html').classList;
  const theme = localStorage.getItem('gbp-web-theme');

  if (isIframe) {
    classList.add('is-simple-iframe');
  }

  if (isPopup) {
    classList.add('is-simple-popup');
  }

  if (theme) {
    classList.add(theme);
  }
};

export default setClasses;
