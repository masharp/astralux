'use strict';

import CartReceipt from './components/cart/CartReceipt';
import CartList from './components/cart/CartList';
import PageFooter from './components/PageFooter';
import LoadingOverlay from './components/LoadingOverlay';

const React = require('react');
const ReactDOM = require('react-dom');
const Request = require('request');

// server side variables sent with render
const currentUser = username;

const LOCAL_URL = 'http://localhost:3000/credentials';
const ASTRALUX_API = 'https://astralux-api.herokuapp.com/api';

class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: null, cart: null, credentials: null, receipt: null };
    this.handleItemRemove = this.handleItemRemove.bind(this);
    this.handlePurchase = this.handlePurchase.bind(this);
    this.handleEmptying = this.handleEmptying.bind(this);
  }
  componentDidMount() {
    const localURL = this.props.localURL;
    const url = `${this.props.apiURL}/users/${this.props.username}`;
    const self = this;

    // query local server for API credentials
    Request.get(localURL, (error, response, body) => {
      if (error) window.location.href = '/error/455';
      const credentials = JSON.parse(body);

      function callback(error, response, body) {
        if (error || body.hasOwnProperty('error')) window.location.href = '/error/455';
        else {
          const content = JSON.parse(body);
          self.setState({ user: content.user, cart: content.user.cart.cart, credentials });
        }
      }

      // request data from API
      Request.get(url, callback).auth(credentials.username, credentials.password, true);
    });
  }
  supressMessages() {
    const failureMsgElement1 = document.getElementById('purchase-failure1');
    const failureMsgElement2 = document.getElementById('purchase-failure2');
    const successMsgElement = document.getElementById('purchase-success');

    successMsgElement.classList.add('hidden');
    failureMsgElement1.classList.add('hidden');
    failureMsgElement2.classList.add('hidden');
  }
  handleItemRemove(event) {
    /* see which item is being removed and pull out current cart */
    const currentCart = this.state.cart;
    const target = Number(event.target.classList[3]);
    const newCart = [];
    const self = this;

    /* surpress purchase warnings if open */
    self.supressMessages();

    for (let x = 0; x < currentCart.length; x++) {
      if (target === currentCart[x].item) continue;
      else newCart.push(currentCart[x]);
    }

    /* create object containg PUT request information */
    const options = {
      url: `${this.props.apiURL}/users/cart/${this.props.username}`,
      method: 'PUT',
      json: { cart: newCart }
    };

    function callback(error, response, body) {
      if (error || body.hasOwnProperty('error')) window.location.href = '/error/455';
      else self.setState({ cart: newCart });
    }

    // request PUT to API
    Request.put(options, callback).auth(this.state.credentials.username, this.state.credentials.password, true);
  }
  handleEmptying(event) {
    const url = `${this.props.apiURL}/users/cart/${this.props.username}`;
    const self = this;
    const newCart = [];

    /* surpress purchase warnings if open */
    self.supressMessages();

    /* create object containg PUT request information */
    const options = {
      url: `${this.props.apiURL}/users/cart/${this.props.username}`,
      method: 'PUT',
      json: { cart: newCart }
    };

    function callback(error, response, body) {
      if (error || body.hasOwnProperty('error')) window.location.href = '/error/455';
      else self.setState({ cart: newCart });
    }

    // request PUT to API
    Request.put(options, callback).auth(this.state.credentials.username, this.state.credentials.password, true);
  }
  handlePurchase(event) {
    const successMsgElement = document.getElementById('purchase-success');
    const failureMsgElement1 = document.getElementById('purchase-failure1');
    const failureMsgElement2 = document.getElementById('purchase-failure2');
    const localURL = this.props.localURL;
    const url = `${this.props.apiURL}/users/purchase/${this.props.username}`;
    const self = this;
    const options = { url, method: 'PUT', json: {} };

    /* extract pertinant information on purchase state */
    const currentCart = this.state.cart;
    const currentBalance = this.state.user.balance;

    /* obtain cart purchase cost */
    const currentCost = currentCart.map((i) => i.amount * i.price).reduce((a, b) => a + b, 0);

    /* surpress purchase warnings if open */
    self.supressMessages();

    // check if user has available balance */
    if (currentBalance < currentCost) {
      failureMsgElement1.classList.remove('hidden');
      return;
    }
    /* finish PUT route options object */
    options.json = { cart: currentCart, balance: currentBalance, cost: currentCost };

    function callback(error, response, body) {
      if (error) console.log(error);
      if (body.hasOwnProperty('error')) console.log(body); //failureMsgElement2.classList.remove('hidden');
      const receipt = JSON.parse(body).transaction;
      console.log(receipt);

      /* show success message then the receipt after 5 seconds */
      successMsgElement.classList.remove('hidden');
      setTimeout(() => {
        self.setState({ receipt })
      }, 3000);
    }

    Request.put(options, callback).auth(this.state.credentials.username, this.state.credentials.password, true);
  }
  render() {
    /* render the user's current cart */
    if (this.state.user !== null && this.state.receipt === null) {
      return (
        React.createElement('div', { id: 'cart-component' },
          React.createElement('h3', { id: 'purchase-success', className: 'hidden' }, 'Purchase successful! Moonlets added to your inventory!'),
          React.createElement('h3', { id: 'purchase-failure1', className: 'hidden' }, 'You do not have enough credits!'),
          React.createElement('h3', { id: 'purchase-failure2', className: 'hidden' }, 'Purchase invalid. Please reload this page.'),
          React.createElement(CartList, { cart: this.state.cart, handleItemRemove: this.handleItemRemove }),
          // div for page buttons
          React.createElement('div', { id: 'cart-buttons' },
          React.createElement('input', { type: 'button', className: 'cart-empty-btn',
            value: 'Empty Cart', onClick: this.handleEmptying }),
            React.createElement('input', { type: 'button', className: 'cart-purchase-btn',
              value: 'Purchase', onClick: this.handlePurchase })
          ),
          React.createElement(PageFooter, null)
        )
      );
    }
    /* if there is a post-transaction receipt, render the component with the receipt */
    if (this.state.receipt !== null) {
      return (
        React.createElement('div', { id: 'receipt-component' },
          React.createElement(CartReceipt, { receipt: this.state.receipt }),
          React.createElement(PageFooter, null)
        )
      );
    }
    return (React.createElement(LoadingOverlay, null));
  }
}

Cart.propTypes = {
  apiURL: React.PropTypes.string.isRequired,
  localURL: React.PropTypes.string.isRequired,
  username: React.PropTypes.string.isRequired,
};

// front end global error handler -> redirect to error page for now
//window.onerror = () => window.location.href = '/error/455';

ReactDOM.render(React.createElement(Cart, { apiURL: ASTRALUX_API, localURL: LOCAL_URL, username: currentUser }),
  document.getElementById('cart'));
