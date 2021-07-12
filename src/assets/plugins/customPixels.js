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
    'outputScale': {
      label: 'Scale output image',
      type: 'number'
    },
    'exportAs': {
      label: 'Export filetype',
      type: 'string'
    },
  };
  this.config = config;
  this.samples = [];
  this.pixelTransitions = [];
  this.saveAs = () => null
  this.progress = () => null
}

PluginSkeleton.prototype.init = function init({ saveAs, progress }) {
  this.saveAs = saveAs;
  this.progress = progress;
  this.setPixelTransitions();
  this.loadImage();
};


PluginSkeleton.prototype.setPixelTransitions = function setPixelTransitions() {
  const ps = this.config.pixelSize;
  this.pixelTransitions = [
    [1, 0, 0, 1, 0, 0],
    [0, 1, -1, 0, ps, 0],
    [-1, 0, 0, -1, ps, ps],
    [0, -1, 1, 0, 0, ps],
    [-1, 0, 0, 1, ps, 0],
    [0, -1, -1, 0, ps, ps],
    [1, 0, 0, -1, 0, ps],
    [0, 1, 1, 0, 0, 0]
  ];
};

PluginSkeleton.prototype.loadImage = function loadImage() {
  const image = new Image();
  image.crossOrigin = 'Anonymous';
  image.src = this.config.imageUrl;

  image.addEventListener('load', () => {
    const sampleCount = Math.floor(image.naturalWidth / this.config.pixelSize);

    this.samples = [...Array(4)]
      .fill(null)
      .map((__, sampleY) => (
        [...Array(sampleCount)]
          .fill(null)
          .map((_, sampleX) => (
            this.pixelTransitions.map((matrix) => (
              this.generateSample({
                image,
                sampleY,
                sampleX,
                matrix,
              })
            ))
          ))
          .flat()
      ));

    console.log(this.samples);
  });
};

PluginSkeleton.prototype.generateSample = function generateSample({ image, sampleX, sampleY, matrix }) {
  const pixelSize = this.config.pixelSize;
  const canvas = document.createElement('canvas');
  canvas.width = this.config.pixelSize;
  canvas.height = this.config.pixelSize;
  const context = canvas.getContext('2d');

  context.setTransform(...matrix);
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.drawImage(image, sampleX * pixelSize, sampleY * pixelSize, pixelSize, pixelSize, 0, 0, pixelSize, pixelSize);

  return context.getImageData(0, 0, pixelSize, pixelSize);
};

PluginSkeleton.prototype.setConfig = function setConfig(configUpdate) {
  Object.assign(this.config, configUpdate);
  this.setPixelTransitions();
  this.loadImage();
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

    const targetContext = targetCanvas.getContext('2d');
    targetContext.fillStyle = '#ffffff';
    targetContext.fillRect(0, 0, targetCanvas.width, targetCanvas.height);

    const x = 0;
    const y = 0;

    const streaks = this.generateStreaks(sourceCanvas.height, sourceCanvas.width);

    const setPixelInContext = this.setPixel({
      sourceContext,
      sourcePalette,
      targetContext,
      streaks,
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

      this.saveImage(targetCanvas, meta);
    }

    setNextPx(0);
  });
};

PluginSkeleton.prototype.setPixel = function setPixel({
  sourceContext,
  sourcePalette,
  targetContext,
  streaks,
}) {
  return (x, y) => {
    const color = sourceContext.getImageData(x, y, 1, 1);
    const hex = `#${
      [...color.data.slice(0, 3)]
        .map(val => val.toString(16).padStart(2, '0'))
        .join('')
    }`;
    const rowIndex = 3 - sourcePalette.findIndex((color) => color === hex);

    const sampleType = this.samples?.[rowIndex] || [[]];
    const pixel = sampleType?.[Math.floor(Math.random() * sampleType.length)] || sampleType[0];

    const brightness = streaks[y][x] ? 192 : 255;
    for (let i = 3; i < pixel.data.length; i += 4) {
      pixel.data[i] = brightness;
    }

    targetContext.putImageData(pixel, x * this.config.pixelSize, y * this.config.pixelSize);
  }
}

PluginSkeleton.prototype.generateStreaks = function generateStreaks(width, height) {
  // create 2d array
  const grid = [...Array(height)].fill(0).map(() => ([...Array(width)].fill(false)));

  const maxLen = 20;

  for (let i = 0; i < height; i++) {
    for (let j = -maxLen; j < width + maxLen; j++) {
      if (Math.random() < 0.125) {
        for (k = j; k < j + Math.random() * maxLen; k += 1) {
          try {
            grid[k][i] = true;
          } catch (err) {}
        }
      }
    }
  }

  return grid;
};

PluginSkeleton.prototype.saveImage = function saveImage(targetCanvas, meta) {
  const exportParams = this.config.exportAs === 'png' ? ['image/png'] : ['image/jpeg', 0.8];
  const exportExtension = this.config.exportAs === 'png' ? 'png' : 'jpg';
  const targetContext = targetCanvas.getContext('2d');
  const saveCanvas = document.createElement('canvas');
  saveCanvas.width = targetCanvas.width * this.config.outputScale;
  saveCanvas.height = targetCanvas.height * this.config.outputScale;

  const saveContext = saveCanvas.getContext('2d');
  saveContext.fillStyle = '#ffffff';
  saveContext.fillRect(0, 0, saveCanvas.width, saveCanvas.height);

  const img = new Image();
  img.addEventListener('load', () => {
    saveContext.drawImage(img, 0, 0, saveCanvas.width, saveCanvas.height);

    saveCanvas.toBlob((finalBlob) => {
      this.saveAs(finalBlob, 'CustomPixels.' + (meta.title ? meta.title + '.' : '') + exportExtension);

      // close overlay
      this.progress(0);
    }, ...exportParams);
  });
  img.src = targetCanvas.toDataURL('image/png');
};

PluginSkeleton.prototype.withSelection = function withSelection(images) {
};

gbpwRegisterPlugin(PluginSkeleton);
