'use strict';

var _ = require('lodash');

function init() {

  var allPlugins = []
    , enabledPlugins = [];

  function plugins() {
    return plugins;
  }

  plugins.base = require('./pluginbase');

  var clientDefaultPlugins = [
    require('./iob')()
    , require('./cob')()
    , require('./boluswizardpreview')()
    , require('./cannulaage')()
  ];

  var serverDefaultPlugins = [
    require('./ar2')()
    , require('./simplealarms')()
    , require('./errorcodes')()
    , require('./iob')()
    , require('./cob')()
    , require('./boluswizardpreview')()
    , require('./treatmentnotify')()
  ];

  plugins.registerServerDefaults = function registerServerDefaults() {
    plugins.register(serverDefaultPlugins);
    return plugins;
  };

  plugins.registerClientDefaults = function registerClientDefaults() {
    plugins.register(clientDefaultPlugins);
    return plugins;
  };

  plugins.register = function register(all) {
    _.forEach(all, function eachPlugin(plugin) {
      allPlugins.push(plugin);
    });
  };

  plugins.init = function init(envOrApp) {
    enabledPlugins = [];
    function isEnabled(plugin) {
      //TODO: unify client/server env/app
      var enable = envOrApp.enabledOptions || envOrApp.enable;
      return enable && enable.indexOf(plugin.name) > -1;
    }

    _.forEach(allPlugins, function eachPlugin(plugin) {
      plugin.enabled = isEnabled(plugin);
      if (plugin.enabled) {
        enabledPlugins.push(plugin);
      }
    });
    return plugins;
  };

  plugins.eachPlugin = function eachPlugin(f) {
    _.forEach(allPlugins, f);
  };

  plugins.eachEnabledPlugin = function eachEnabledPlugin(f) {
    _.forEach(enabledPlugins, f);
  };

  plugins.shownPlugins = function(sbx) {
    return _.filter(enabledPlugins, function filterPlugins(plugin) {
      return sbx && sbx.showPlugins && sbx.showPlugins.indexOf(plugin.name) > -1;
    });
  };

  plugins.eachShownPlugins = function eachShownPlugins(sbx, f) {
    _.forEach(plugins.shownPlugins(sbx), f);
  };

  plugins.hasShownType = function hasShownType(pluginType, sbx) {
    return _.find(plugins.shownPlugins(sbx), function findWithType(plugin) {
      return plugin.pluginType == pluginType;
    }) != undefined;
  };

  plugins.setProperties = function setProperties(sbx) {
    plugins.eachEnabledPlugin( function eachPlugin (plugin) {
      plugin.setProperties && plugin.setProperties(sbx.withExtendedSettings(plugin));
    });
  };

  plugins.checkNotifications = function checkNotifications(sbx) {
    plugins.eachEnabledPlugin( function eachPlugin (plugin) {
      plugin.checkNotifications && plugin.checkNotifications(sbx.withExtendedSettings(plugin));
    });
  };

  plugins.updateVisualisations = function updateVisualisations(sbx) {
    plugins.eachShownPlugins(sbx, function eachPlugin(plugin) {
      plugin.updateVisualisation && plugin.updateVisualisation(sbx.withExtendedSettings(plugin));
    });
  };

  plugins.enabledPluginNames = function enabledPluginNames() {
    return _.map(enabledPlugins, function mapped(plugin) {
      return plugin.name;
    }).join(' ');
  };

  plugins.extendedClientSettings = function extendedClientSettings (allExtendedSettings) {
    var clientSettings = {};
    _.forEach(clientDefaultPlugins, function eachClientPlugin (plugin) {
      clientSettings[plugin.name] = allExtendedSettings[plugin.name];
    });
    return clientSettings;
  };

  return plugins();

}

module.exports = init;