/**
 * Plugin.js file, set configs, routes, hooks and events here
 *
 * see http://wejs.org/docs/we/plugin
 */
module.exports = function loadPlugin(projectPath, Plugin) {
  var plugin = new Plugin(__dirname);

  plugin.addJs('we-plugin-element-overlay', {
    weight: 4,
    pluginName: 'we-plugin-element-overlay',
    path: 'files/public/overlay.js'
  });
  plugin.addJs('we-plugin-element-overlay', {
    weight: 5,
    pluginName: 'we-plugin-element-overlay',
    path: 'files/public/we-plugin-element-overlay.js'
  });
  plugin.addCss('we-plugin-element-overlay', {
    weight: 5,
    pluginName: 'we-plugin-element-overlay',
    path: 'files/public/we-plugin-element-overlay.css'
  });

  return plugin;
};