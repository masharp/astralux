'use strict';
const Request = require('request');
const React = require('react');

function handleRefundClick(event) {
  // get the username and id of the transaction to be refunded
  const target = event.target.classList[1].split('-');
  const username = target[0];
  const transactionID = target[1];
  console.log(target, username, transactionID);
}

// TODO: Sort by date in descending order
export default function TransactionsPanel(props) {
  const historyNodes = props.user.transactions.history.map((h, i) => {
    const priceType = h.transaction == 'purchase' ? 'reduction' : 'addition';
    const price = h.transaction == 'purchase' ? `- ${h.price}` : `+ ${h.price}`;
    const showRefund = h.transaction == 'purchase' ? '' : 'hidden';
    const date = h.timestamp.split(' ')[0];

    return (
      React.createElement('p', { className: 'transaction', key: `transacton-${i}` },
        React.createElement('span', { className: 'transaction-id' }, h.id),
        React.createElement('span', { className: 'transaction-date' }, date),
        React.createElement('span', { className: `transaction-${h.transaction}` }, h.transaction),
        React.createElement('a', { className: 'transaction-moonlet', href: `/moonlet/${h.moonlet}/${h.moonlet}` },
          `Moonlet: ${h.moonlet}`),
        React.createElement('span', { className: `transaction-${priceType}` }, price),
        React.createElement('a', { className: `refund-btn ${showRefund} ${props.user.username}-${h.id}`,
          onClick: handleRefundClick }, 'Refund')
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
  user: React.PropTypes.object.isRequired
};
