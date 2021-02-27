/* eslint-disable */
function DummyPlugin(env) {
  this.name = 'Dummy Plugin';
  this.description = 'This is a dummy plugin which just \'console.log\'s some stuff';
  console.log(env);
}

DummyPlugin.prototype.init = function init() {
  // custom init code
};

DummyPlugin.prototype.withImage = function withImage(image) {
  // get basic metadata
  console.log(image.meta);

  // get the palette
  console.log(image.palette);

  // get the tiles as array of strings
  image.getTiles().then((tiles) => console.log(tiles));

  // get canvas
  image.getCanvas().then((canvas) => console.log(canvas));
};

DummyPlugin.prototype.withSelection = function withSelection(images) {
  console.log(images);
};

gbpwRegisterPlugin(DummyPlugin);
