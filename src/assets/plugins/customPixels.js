/* eslint-disable */

/*
 * Custom Pixels Plugin
 *
 * This plugin is a plain JS implementation of the original GameboyPrinterPaperSimulation by Raphaël Boichot
 * https://github.com/Raphael-Boichot/GameboyPrinterPaperSimulation
 *
 * It's recommended to use a service like jsdelivr to add it to the Gameboy Printer Web App
 * https://herrzatacke.github.io/gb-printer-web/#/settings/plugins
 *
 */

function CustomPixelsPlugin(env, config) {
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
      label: 'Scale output image (in %)',
      type: 'number'
    },
    'exportAs': {
      label: 'Export filetype',
      type: 'string'
    },
    'streakIntensity': {
      label: 'Intensity of streaks (0-100)',
      type: 'number'
    },
    'flipRotate': {
      label: 'Flip and rotate sample pixels (set to !=0 to activate)',
      type: 'number'
    },
  };

  this.canRun = false;
  this.config = config;
  this.samples = null;
  this.pixelTransitions = null;
  this.saveAs = () => null
  this.progress = () => null
}

CustomPixelsPlugin.prototype.init = function init({ saveAs, progress }) {
  this.saveAs = saveAs;
  this.progress = progress;
  this.checkConfig();
};

CustomPixelsPlugin.prototype.checkConfig = function checkConfig() {
  const {
    imageUrl,
    pixelSize,
    outputScale,
    exportAs,
    streakIntensity,
    flipRotate,
  } = this.config;

  this.canRun = (
    Boolean(imageUrl) &&
    Boolean(pixelSize) &&
    Boolean(outputScale)
  );

  this.config.exportAs = exportAs || 'jpg';
  this.config.streakIntensity = streakIntensity || 0;
};

CustomPixelsPlugin.prototype.setPixelTransitions = function setPixelTransitions() {
  const ps = this.config.pixelSize;
  if (ps && this.config.flipRotate) {
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
  } else {
    this.pixelTransitions = [
      [1, 0, 0, 1, 0, 0],
    ];
  }
};

CustomPixelsPlugin.prototype.loadImage = function loadImage() {
  if (this.samples) {
    return Promise.resolve();
  }

  const image = new Image();
  image.crossOrigin = 'Anonymous';

  return new Promise((resolve, reject) => {
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

      resolve();
    });

    image.addEventListener('error', reject);

    image.src = this.config.imageUrl;
  });
};

CustomPixelsPlugin.prototype.generateSample = function generateSample({ image, sampleX, sampleY, matrix }) {
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

CustomPixelsPlugin.prototype.setConfig = function setConfig(configUpdate) {
  this.samples = null;
  this.pixelTransitions = null;
  Object.assign(this.config, configUpdate);
  this.checkConfig();
};

CustomPixelsPlugin.prototype.withImage = function withImage(image) {
  if (!this.canRun) {
    alert(this.name + ' is missing config settings');
    return;
  }

  this.setPixelTransitions();

  Promise.all([
    image.getMeta(),
    image.getPalette(),
    image.getCanvas(),
    this.loadImage(),
  ]).then(([meta, {palette: sourcePalette}, sourceCanvas]) => {

    console.log(meta);

    if (meta.isRGBN || meta.lockFrame) {
      alert(this.name + ' does not work with RGBN images or images with `color-locked frame`');
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

CustomPixelsPlugin.prototype.setPixel = function setPixel({
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

    if (this.config.streakIntensity) {
      const intensity = Math.min(255, Math.max(0, 255 - (this.config.streakIntensity * 2.55)));
      const brightness = streaks[y][x] ? intensity : 255;
      for (let i = 3; i < pixel.data.length; i += 4) {
        pixel.data[i] = brightness;
      }
    }

    targetContext.putImageData(pixel, x * this.config.pixelSize, y * this.config.pixelSize);
  }
}

CustomPixelsPlugin.prototype.generateStreaks = function generateStreaks(width, height) {
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

CustomPixelsPlugin.prototype.saveImage = function saveImage(targetCanvas, meta) {
  const exportParams = this.config.exportAs === 'png' ? ['image/png'] : ['image/jpeg', 0.8];
  const exportExtension = this.config.exportAs === 'png' ? 'png' : 'jpg';
  const targetContext = targetCanvas.getContext('2d');
  const saveCanvas = document.createElement('canvas');
  saveCanvas.width = Math.floor(targetCanvas.width * (this.config.outputScale / 100));
  saveCanvas.height = Math.floor(targetCanvas.height * (this.config.outputScale / 100));

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

CustomPixelsPlugin.prototype.withSelection = function withSelection(images) {
};

gbpwRegisterPlugin(CustomPixelsPlugin);
