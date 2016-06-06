'use strict';

import CartList from './components/cart/CartList';
import PageFooter from './components/PageFooter';
import LoadingOverlay from './components/LoadingOverlay';

const React = require('react');
const ReactDOM = require('react-dom');
const Request = require('request');

// server side variables sent with render
const appCredentials = credentials;
const currentUser = username;

const ASTRALUX_API = `https://astralux-api.herokuapp.com/api/users/${username}`;

class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: null, cart: null };
    this.handleItemRemove = this.handleItemRemove.bind(this);
    this.handlePurchase = this.handlePurchase.bind(this);
    this.handleEmptying = this.handleEmptying.bind(this);
  }
  componentDidMount() {
    const username = this.props.apiCredentials.username;
    const password = this.props.apiCredentials.password;
    const url = this.props.apiURL;
    const self = this;

    function callback(error, response, body) {
      if (error || JSON.parse(body).hasOwnProperty('error')) window.location.href = '/error/455';

      const content = JSON.parse(body);
      self.setState({ user: content.user, cart: content.user.cart.cart });
    }

    Request.get(url, callback).auth(username, password, true);
  }
  handleItemRemove(event) {
    console.log(event.target);
  }
  handlePurchase(event) {

  }
  handleEmptying(event) {

  }
  render() {
    if (this.state.user !== null) {
      console.log(this.state.user);
      console.log(this.state.cart);

      return (
        React.createElement('div', { id: 'cart-component' },
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
    return (React.createElement(LoadingOverlay, null));
  }
}

Cart.propTypes = {
  apiURL: React.PropTypes.string.isRequired,
  apiCredentials: React.PropTypes.object.isRequired,
};

// front end global error handler -> redirect to error page for now
//window.onerror = () => window.location.href = '/error/455';

ReactDOM.render(React.createElement(Cart, { apiURL: ASTRALUX_API, apiCredentials: appCredentials }),
  document.getElementById('cart'));
