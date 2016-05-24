/**
 * Module that exports the reusable loading overlay React component
 *
 * @return {object} Component's React element
 */
const React = require('react');

export default function LoadingOverlay() {
  return (
    React.createElement('div', { id: 'load-screen' },
      React.createElement('i', { className: 'fa fa-spinner fa-pulse' })
    )
  );
}
