function isFullScreenFn () {
  let isFull = false;

  isFull = document.fullScreen ||
    document.webkitIsFullScreen ||
    document.mozFullScreen ||
    document.msFullscreenElement ||
    document.fullscreenElement;

  return !!isFull;
}

function requestFullscreen (ele) {
  let promise = null;
  if (ele.requestFullscreen) {
    promise = ele.requestFullscreen();
  } else if (ele.mozRequestFullScreen) {
    promise = ele.mozRequestFullScreen();
  } else if (ele.webkitRequestFullScreen) {
    promise = ele.webkitRequestFullScreen();
  } else if (ele.msRequestFullscreen) {
    promise = ele.msRequestFullscreen();
  }
  catchFullScreenError(promise);

  return promise;
}

function exitFullscreen () {
  let promise = null;
  if (document.exitFullscreen) {
    promise = document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    promise = document.mozCancelFullScreen();
  } else if (document.webkitCancelFullScreen) {
    promise = document.webkitCancelFullScreen();
  } else if (document.msExitFullscreen) {
    promise = document.msExitFullscreen();
  }
  catchFullScreenError(promise);

  return promise;
}

function catchFullScreenError (promise) {
  if (({}.toString.call(promise)) === '[object Promise]') {
    promise.then(() => {
    }).catch(err => {
      console.log(`Failed to enable full-screen mode: ${err.message} (${err.name})`);
    });
  }
}

export default {
  isFullScreenFn,
  requestFullscreen,
  exitFullscreen,
  catchFullScreenError
};
