'use strict';

const React = require('react');
// TODO: Sort by date in descending order
export default function TransactionsPanel(props) {
  const historyNodes = props.history.map((h, i) => {
    return (
      React.createElement('p', { className: 'transaction', key: `transacton-${i}` },
        React.createElement('span', { className: 'transaction-date' }, h.timestamp),
        React.createElement('span', { className: `transaction-${h.transaction}` }, h.transaction),
        React.createElement('span', { className: 'transaction-moonlet' }, h.moonlet),
        React.createElement('span', { className: 'transaction-reduction' }, '- 2000 Credits')
      )
    );
  })
  return (
    React.createElement('div', { id: 'transaction-panel' },
      React.createElement('h2', { className: 'transaction-header' }, `Your Transaction History`),
      React.createElement('div', { id: 'transaction-history' }, historyNodes)
    )
  );
}

TransactionsPanel.propTypes = {
  history: React.PropTypes.array.isRequired
};
