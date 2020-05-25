// https://www.w3schools.com/jsref/met_element_exitfullscreen.asp

// /* View in fullscreen */
const openFullscreen = (elem) => {
  if (document.fullscreenElement) {
    return;
  }

  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
};

/* Close fullscreen */
const closeFullscreen = () => {
  if (!document.fullscreenElement) {
    return;
  }

  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen();
  }
};

export {
  openFullscreen,
  closeFullscreen,
};
