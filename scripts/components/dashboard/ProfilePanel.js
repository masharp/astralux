'use strict';

import ProfileInventory from './ProfileInventory';

const React = require('react');

export default function ProfilePanel(props) {
  return (
    React.createElement('div', { id: 'profile-panel' },
      React.createElement('div', { id: 'profile-panel-header' },
        React.createElement('h2', { className: 'profile-username' }, `${props.user.display_name}\'s Profile`),
        React.createElement('img', { src: '/assets/login-alien.png' })
      ),
      React.createElement('div', { id: 'profile-panel-wallet' },
        React.createElement('h3', { className: 'wallet-header' }, 'Astralux Galactic Account'),
        React.createElement('p', { className: 'wallet-balance' }, `Current Balance: ${props.user.balance} Credits`),
        React.createElement('p', { className: 'wallet-transactions' }, `Recent Transactions: -2202 Credits`)
      ),
      React.createElement(ProfileInventory, { user: props.user, moonlets: props.moonlets })
    )
  );
}

ProfilePanel.propTypes = {
  user: React.PropTypes.object.isRequired,
  moonlets: React.PropTypes.array.isRequired,
};
