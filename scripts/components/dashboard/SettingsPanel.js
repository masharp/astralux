'use strict';

const React = require('react');

export default function SettingsPanel(props) {
  return (
    React.createElement('h2', {}, 'Settings')
  );
}

SettingsPanel.propTypes = {
  user: React.PropTypes.object.isRequired
}
