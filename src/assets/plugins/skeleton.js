/* eslint-disable */
function PluginSkeleton(env, config) {
  this.name = 'Plugin Skeleton'; // Use a good name here
  this.description = 'This plugin exposes all necessary methods and properties'; // Add a small description of your plugin
  this.configParams = {}; // See dummy.js on how to define config params
  this.config = config;
}

PluginSkeleton.prototype.init = function init() {
};

PluginSkeleton.prototype.setConfig = function setConfig(configUpdate) {
  Object.assign(this.config, configUpdate);
};

PluginSkeleton.prototype.withImage = function withImage(image) {
};

PluginSkeleton.prototype.withSelection = function withSelection(images) {
};

gbpwRegisterPlugin(PluginSkeleton);
