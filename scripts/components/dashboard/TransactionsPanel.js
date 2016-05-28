'use strict';
const Request = require('request');
const React = require('react');

export default function TransactionsPanel(props) {

  /* click event for refunding a previous transaction */
  function handleRefundClick(event) {
    // get the username and id of the transaction to be refunded
    const target = event.target.classList[1].split('-');
    const username = props.user.username;
    const transactionID = target[1];

    let alertBox = window.confirm('Are you sure you want to refund this transaction?');
    console.log(username, transactionID);
    console.log(alertBox);
  }

  /* contruct each row of transaction history via table rows */
  const historyNodes = props.user.transactions.history.map((h, i) => {
    const priceType = h.transaction != 'purchase' ? 'addition' : 'reduction'; // adjustment type (incr or decr)
    const price = h.transaction != 'purchase' ? `+ ${h.price}` : `- ${h.price}`; // price adjustment (incr or decr)
    const showRefund = h.transaction == 'refund' ? 'hidden' : ''; // if transaction is refundable - show a button to allow
    const date = h.timestamp.split(' ')[0];

    return (
      React.createElement('tr', { className: 'transaction', key: `transacton-${i}` },
        React.createElement('td', { className: 'transaction-id' }, h.id),
        React.createElement('td', { className: 'transaction-date' }, date),
        React.createElement('td', { className: `transaction-${h.transaction}` }, h.transaction),
        React.createElement('td', { className: 'transaction-moonlet', href: `/moonlet/${h.moonlet}/${h.moonlet}` },
          `Moonlet: ${h.moonlet}`),
        React.createElement('td', { className: `transaction-${priceType}` }, price),
        React.createElement('td', { className: `refund-btn ${showRefund} ${props.user.username}-${h.id}`,
          onClick: handleRefundClick }, 'Refund')
      )
    );
  })

  return (
    React.createElement('div', { id: 'transaction-panel' },
      React.createElement('h2', { className: 'transaction-header' }, `Your Transaction History`),
      React.createElement('table', { id: 'transaction-history' },
        React.createElement('thead', null,
          React.createElement('tr', null,
            React.createElement('th', null, 'ID'),
            React.createElement('th', null, 'Date'),
            React.createElement('th', null, 'Type'),
            React.createElement('th', null, 'Item'),
            React.createElement('th', null, 'Balance'),
            React.createElement('th', null, 'Actions')
          )
        ),
        React.createElement('tbody', null, historyNodes)
      )
    )
  );
}

TransactionsPanel.propTypes = {
  user: React.PropTypes.object.isRequired
};
