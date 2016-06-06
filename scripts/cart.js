'use strict';

import CartList from './components/cart/CartList';
import PageFooter from './components/PageFooter';
import LoadingOverlay from './components/LoadingOverlay';

const React = require('react');
const ReactDOM = require('react-dom');
const Request = require('request');

// server side variables sent with render
const currentUser = username;

const LOCAL_URL = 'http://localhost:3000/credentials';
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
    const localURL = this.props.localURL;
    const url = this.props.apiURL;
    const self = this;

    // query local server for API credentials
    Request.get(localURL, (error, response, body) => {
      if (error) window.location.href = '/error/455';
      const credentials = JSON.parse(body);

      function callback(error, response, body) {
        if (error || JSON.parse(body).hasOwnProperty('error')) window.location.href = '/error/455';

        const content = JSON.parse(body);
        self.setState({ user: content.user, cart: content.user.cart.cart });
      }

      // request data from API
      Request.get(url, callback).auth(credentials.username, credentials.password, true);
    });
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
  localURL: React.PropTypes.string.isRequired,
};

// front end global error handler -> redirect to error page for now
//window.onerror = () => window.location.href = '/error/455';

ReactDOM.render(React.createElement(Cart, { apiURL: ASTRALUX_API, localURL: LOCAL_URL }),
  document.getElementById('cart'));
