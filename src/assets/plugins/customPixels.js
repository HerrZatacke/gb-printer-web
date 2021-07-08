/* eslint-disable */
function PluginSkeleton(env, config) {
  this.name = 'Custom Pixels Plugin';
  this.description = 'Select any external image with pixel representations';
  this.configParams = {
    'imageUrl': {
      label: 'External URL of the image file containing custom pixels',
      type: 'string'
    },
    'pixelSize': {
      label: 'Side length of a pixel',
      type: 'number'
    },
  };
  this.config = config;
  this.sampleContext = null;
  this.sampleCount = 1;
  this.saveAs = () => null
  this.progress = () => null
}

PluginSkeleton.prototype.init = function init({ saveAs, progress }) {
  this.saveAs = saveAs;
  this.progress = progress;

  const image = new Image();
  image.crossOrigin = 'Anonymous';
  image.src = this.config.imageUrl;

  console.log(this.config);

  image.addEventListener('load', () => {
    const sampleCanvas = document.createElement('canvas');
    sampleCanvas.width = image.naturalWidth;
    sampleCanvas.height = this.config.pixelSize * 4;
    sampleCanvas.style.position = 'absolute';
    sampleCanvas.style.top = '80px';

    this.sampleCount = Math.floor(sampleCanvas.width / this.config.pixelSize);

    this.sampleContext = sampleCanvas.getContext('2d');
    this.sampleContext.fillStyle = '#ffffff';
    this.sampleContext.fillRect(0, 0, sampleCanvas.width, sampleCanvas.height);
    this.sampleContext.drawImage(image, 0, 0);
  });
};

PluginSkeleton.prototype.setConfig = function setConfig(configUpdate) {
  Object.assign(this.config, configUpdate);
};

PluginSkeleton.prototype.withImage = function withImage(image) {

  Promise.all([
    image.getMeta(),
    image.getPalette(),
    image.getCanvas(),
  ]).then(([meta, {palette: sourcePalette}, sourceCanvas]) => {

    if (meta.isRGBN) {
      alert(this.name + ' does not work with RGBN images');
      return;
    }

    const sourceContext = sourceCanvas.getContext('2d');
    const pxHeight = sourceCanvas.height * this.config.pixelSize;
    const pxWidth = sourceCanvas.width * this.config.pixelSize;

    const targetCanvas = document.createElement('canvas');
    targetCanvas.width = pxWidth;
    targetCanvas.height = pxHeight;
    targetCanvas.style.width = (4 * sourceCanvas.width) + 'px';
    targetCanvas.style.height = (4 * sourceCanvas.height) + 'px';

    const targetContext = targetCanvas.getContext('2d');
    targetContext.fillStyle = '#ffffff';
    targetContext.fillRect(0, 0, targetCanvas.width, targetCanvas.height);

    const x = 0;
    const y = 0;

    const setPixelInContext = this.setPixel({
      sourceContext,
      sourcePalette,
      targetContext,
    });

    const setNextPx = (x) => {

      // render one image column
      for (let y = 0; y < sourceCanvas.height; y += 1) {
        setPixelInContext(x, y);
      }

      const nextX = (x + 1) % sourceCanvas.width;

      // Not done yet
      if (nextX) {
        window.requestAnimationFrame(() => {
          this.progress(x / sourceCanvas.width);
          setNextPx(nextX);
        });
        return;
      }

      // download image
      targetCanvas.toBlob((blob) => {
        this.saveAs(blob, 'CustomPixels.' + (meta.title ? meta.title + '.' : '') + 'jpg');
      }, 'image/jpeg', 0.8);

      // close overlay
      this.progress(0);
    }

    setNextPx(0);
  });
};

PluginSkeleton.prototype.setPixel = function setPixel({
  sourceContext,
  sourcePalette,
  targetContext,
}) {
  return (x, y) => {
    const color = sourceContext.getImageData(x, y, 1, 1);
    const hex = `#${
      [...color.data.slice(0, 3)]
        .map(val => val.toString(16).padStart(2, '0'))
        .join('')
    }`;
    const rowIndex = 3 - sourcePalette.findIndex((color) => color === hex);

    const pixel = this.sampleContext.getImageData(
      Math.floor(Math.random() * this.sampleCount) * this.config.pixelSize,
      rowIndex * this.config.pixelSize,
      this.config.pixelSize,
      this.config.pixelSize
    );
    targetContext.putImageData(pixel, x * this.config.pixelSize, y * this.config.pixelSize);
  }
}

PluginSkeleton.prototype.withSelection = function withSelection(images) {
};

gbpwRegisterPlugin(PluginSkeleton);
