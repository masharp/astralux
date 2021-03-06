/* This is a module that contains a stateless react component, which constructs
 * the user's transaction history for use in the user's dashboard. includes
 * functionality for issuing refunds for past transactions */

'use strict';

import PageFooter from '../PageFooter';

const Request = require('request');
const React = require('react');

 /**
  * Function that takes the user prop and constructs a react module that displays
  * the user's past transactions as a table.
  * @param {object} props - user: props.user
  */
export default function TransactionsPanel(props) {
  /**
   * Function that takes the user object and constructs a node for each transaction
   * item
   * @param {object} user - object containing user's transaction and profile information
   * @return {array} - array of react components
   */
   function constructHistory(user) {
     const history = user.transactions.history;

     const nodes = history.map((h, i) => {
       const priceType = h.transaction != 'purchase' ? 'addition' : 'reduction'; // adjustment type (incr or decr)
       const price = h.transaction != 'purchase' ? `+ ${h.price}` : `- ${h.price}`; // price adjustment (incr or decr)
       const showRefund = h.transaction == 'refund' ? 'hidden' : ''; // if transaction is refundable - show a button to allow
       const date = h.timestamp.split(' ')[0]; // only show the date part of the utc timestamp
       const transactionMoonlets = h.moonlets.map((m, i) => m.item);

       // components that compose a single transaction
       return (
         React.createElement('tr', { className: 'transaction', key: `transaction-${i}` },
           React.createElement('td', { className: 'transaction-id' }, h.id),
           React.createElement('td', { className: 'transaction-date' }, date),
           React.createElement('td', { className: `transaction-${h.transaction}` }, h.transaction),
           React.createElement('td', { className: 'transaction-moonlet' }, transactionMoonlets.join(', ')),
           React.createElement('td', { className: `transaction-${priceType}` }, price),
           React.createElement('td', { className: `refund-btn ${showRefund} ${user.username}-${h.id}`,
             onClick: handleRefundClick }, 'Refund')
         )
       );
     });

     return nodes;
   }

   /**
    * Function that handles the refund request via a promise
    * @param {string} username - username of the user
    * @param {object} credentials - api credentials
    * @param {string} url - api url
    * @param {int} transaction - id of transaction to be refunded
    * @return {object} - the new refund transaction
    */
    function refundTransaction(username, credentials, url, transaction) {
      return new Promise((resolve, reject) => {
        const credentialsUsername = credentials.username;
        const credentialsPassword = credentials.password;
        let result = null;

        const options = {
          url: `${url}/users/refund/${username}`,
          method: 'PUT',
          json: { transaction }
        };
        function refundCallback(error, response, body) {
          if (error || body.hasOwnProperty('error')) {
            error = body.error ? body.error : error;
            reject(error);
          }

          resolve(body.transaction);
        }

        Request.put(options, refundCallback).auth(credentialsUsername, credentialsPassword, true);
      });
    }

   /**
    * Click handler for issuing refunds. triggers a server request which then
    * updates the view with success or failure. if success, adds a new line to
    * transaction lists. Does not alter state. Upon user navigation, change should
    * be reflected in the database and therefor the global state
    * @param {object} - click event browser object
    */
   function handleRefundClick(event) {
     // get the username and id of the transaction to be refunded
     const target = event.target.classList[1].split('-');
     const username = props.user.username;
     const transactionID = target[1];
     const credentials = props.credentials;
     const url = props.url;

     const refundSpinner = document.getElementById('refund-spinner');
     const refundSuccess = document.getElementById('refund-success');

     refundSuccess.classList.add('hidden');

     let alertBox = window.confirm('Are you sure you want to refund this transaction?');

     if (alertBox) {
       refundSpinner.classList.remove('hidden');

       // resolves an object containing the refund transaction object. may use in the future
       refundTransaction(username, credentials, url, transactionID).then((result) => {
         refundSuccess.classList.remove('hidden');
         refundSpinner.classList.add('hidden');

         setTimeout(() => {
           props.query(credentials);
         }, 3000);
       }).catch((error) => { window.location.href = '/error/455'; });
     }
   }

  /* contruct each row of transaction history via table rows */
  const historyNodes = constructHistory(props.user);

  return (
    React.createElement('div', { id: 'transaction-panel' },
      React.createElement('h2', { className: 'transaction-header' }, `Your Transaction History`),
      React.createElement('div', { id: 'refund-status' },
        React.createElement('p', { id: 'refund-success', className: 'hidden' },
          'Your refund was successful!'),
        React.createElement('i', { id: 'refund-spinner', className: 'fa fa-spinner fa-pulse hidden' })
      ),
      React.createElement('table', { id: 'transaction-history' },
        // transaction table header
        React.createElement('thead', null,
          React.createElement('tr', null,
            React.createElement('th', null, 'ID'),
            React.createElement('th', null, 'Date'),
            React.createElement('th', null, 'Type'),
            React.createElement('th', null, 'Items'),
            React.createElement('th', null, 'Balance'),
            React.createElement('th', null, 'Actions')
          )
        ),
        React.createElement('tbody', null, historyNodes)
      ),
      React.createElement(PageFooter, null)
    )
  );
}

TransactionsPanel.propTypes = {
  user: React.PropTypes.object.isRequired,
  credentials: React.PropTypes.object.isRequired,
  url: React.PropTypes.string.isRequired,
  query: React.PropTypes.func.isRequired,
};
