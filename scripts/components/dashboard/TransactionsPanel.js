'use strict';

const React = require('react');

export default function TransactionsPanel(props) {
  return (
    React.createElement('div', { id: 'transaction-panel' },
      React.createElement('h2', { className: 'transaction-header' }, 'Transaction History'),
      React.createElement('div', { id: 'transaction-history' }

      )
    )
  );
}

TransactionsPanel.propTypes = {
};
