import React from 'react';
// import PropTypes from 'prop-types';
import GitSettings from './pages/GitSettings';
import GenericSettings from './pages/GenericSettings';
import ExportSettings from './pages/ExportSettings';
import DevURLSettings from './pages/DevURLSettings';
import PluginSettings from '../PluginSettings';

// eslint-disable-next-line arrow-body-style
const Settings = () => {
  return (
    <div className="settings">
      <GenericSettings />
      <DevURLSettings />
      <GitSettings />
      <PluginSettings />
      <ExportSettings />
    </div>
  );
};

Settings.propTypes = {};

Settings.defaultProps = {};

export default Settings;
