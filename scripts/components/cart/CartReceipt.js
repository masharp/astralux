/* This is a module that contains a stateless react component, which constructs
 * the a receipt upon purchase of a user's cart. */

'use strict';

const React = require('react');

export default function CartReceipt(props) {

  /* contruct each row of transaction history via table rows */
  const receiptMoonlets = props.receipt.moonlets.map((m) => m.item).join(', ');

  return (
    React.createElement('div', { id: 'cart-receipt' },
      React.createElement('h2', { className: 'receipt-header' }, 'Purchase Receipt'),
      React.createElement('p', { className: 'receipt-id' }, 'Transaction ID:',
        React.createElement('span', { className: 'receipt-number' }, props.receipt.id)
      ),
      React.createElement('p', { className: 'receipt-moonlets' }, `Moonlets: ${receiptMoonlets}`),
      React.createElement('p', { className: 'receipt-cost' }, 'Cost: ',
        React.createElement('span', { className: 'receipt-cost-point' }, props.receipt.price)
      ),
      React.createElement('p', { className: 'receipt-date' }, `Date: ${props.receipt.timestamp}`),
      React.createElement('a', { href: '/dashboard/admin' }, 'View New Moonlets!')
    )
  );
}

CartReceipt.propTypes = {
  receipt: React.PropTypes.object.isRequired,
};
