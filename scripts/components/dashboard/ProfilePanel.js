/* This is a module that contains a stateless react component, which constructs
 * the user's profile panel in their dashboard. Includes a 'wallet' for balance info,
 * a profile picture, and an inventory of the user's moonlets */
 
'use strict';

import ProfileInventory from './ProfileInventory';

const React = require('react');

/**
 * Function that takes the user prop and the global moonlets prop and construct a
 * react module for use in the dashboard component.
 * @param {object} props - user: props.user, global moonlets: props.moonlets
 */
export default function ProfilePanel(props) {
  /**
   * Function that takes the transactions array and parses each transaction for a
   * recent transactions credit amount
   * @param {array} transactions - array of transaction objects
   * @return {number} - resulting recent transaction amount (positive or negative)
   */
  function parseTransactions(transactions) {
    const history = transactions.history;
    let recent = 0;

    for (let x = 0; x < history.length; x++) {
      const item = history[x];

      if (item.transaction === 'purchase') { // if a purchase, subtract
        recent -= item.price;
      } else if (item.transaction === 'refund' || item.transaction === 'credit') { // if a credit or refund, add
        recent += item.price;
      }
    }

    return recent;
  }

  return (
    React.createElement('div', { id: 'profile-panel' },
      React.createElement('div', { id: 'profile-panel-header' },
        React.createElement('h2', { className: 'profile-username' }, `${props.user.display_name}\'s Profile`),
        React.createElement('img', { src: '/assets/login-alien.png' })
      ),
      React.createElement('div', { id: 'profile-panel-wallet' },
        React.createElement('h3', { className: 'wallet-header' }, 'Astralux Galactic Account'),
        React.createElement('p', { className: 'wallet-balance' }, `Current Balance: ${props.user.balance} Credits`),
        React.createElement('p', { className: 'wallet-transactions' }, `Recent Transactions: ${parseTransactions(props.user.transactions)} Credits`)
      ),
      React.createElement(ProfileInventory, { user: props.user, moonlets: props.moonlets })
    )
  );
}

ProfilePanel.propTypes = {
  user: React.PropTypes.object.isRequired,
  moonlets: React.PropTypes.array.isRequired,
};
