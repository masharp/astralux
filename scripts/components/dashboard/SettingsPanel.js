'use strict';

const React = require('react');
const Request = require('request');

export default function SettingsPanel(props) {
  function handleClicks(event) {
    console.log(event.target);
  }
  const currentEmail = props.user.email.length > 0 ? props.user.email : 'N/A';
  return (
    React.createElement('div', { id: 'settings-panel' },
      React.createElement('h2', { className: 'settings-header' }, 'Settings'),
      React.createElement('div', { id: 'email-update' },
        React.createElement('h3', { className: 'email-update-header' }, 'Update Email'),
        React.createElement('p', { className: 'current-email' }, 'Current Email: ',
          React.createElement('span', { className: 'email' }, currentEmail)
        ),
        React.createElement('label', { className: 'new-label' }, 'New Email: '),
        React.createElement('input', { type: 'text', id: 'new-email-input' }),
        React.createElement('br', null),
        React.createElement('br', null),
        React.createElement('label', { className: 'confirm-label' }, 'Confirm Email: '),
        React.createElement('input', { type: 'text', id: 'confirm-email-input' }),
        React.createElement('br', null),
        React.createElement('br', null),
        React.createElement('a', { id: 'update-email-btn', onClick: handleClicks }, 'Update')
      ),
      React.createElement('div', { id: 'danger-zone' },
        React.createElement('h3', { className: 'danger-zone-header' }, 'Danger Zone'),
        React.createElement('div', { id: 'delete-account' },
          React.createElement('a', { id: 'refund-all-btn', onClick: handleClicks }, 'Delete Account')
        )
      ),
      React.createElement('div', { className: 'clear-filler' })
    )
  );
}

SettingsPanel.propTypes = {
  user: React.PropTypes.object.isRequired
}
