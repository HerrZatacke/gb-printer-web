/* eslint-disable */
function DummyPlugin(env) {
  this.name = 'Dummy Plugin';
  console.log(env);
}

DummyPlugin.prototype.init = function init() {
  // custom init code
};

DummyPlugin.prototype.withImage = function withImage(image) {
  console.log(image);
};

DummyPlugin.prototype.withSelection = function withSelection(images) {
  console.log(images);
};

gbpwRegisterPlugin(DummyPlugin);
